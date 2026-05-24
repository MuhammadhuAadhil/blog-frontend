import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./common/Footer";
import auth from "../config/firebase";
import API_BASE_URL from "../config/api";
import { FiBookOpen, FiClock, FiEdit3, FiHeart, FiTrash2 } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import img1 from "../assets/blog pg.jpg";

const ADMIN_UID = "NIOdBl7v8IVnYVTz0nAhTSPaExJ2";

function getAuthorName(user) {
  if (!user) {
    return "";
  }

  if (user.displayName?.trim()) {
    return user.displayName.trim();
  }

  if (user.email?.includes("@")) {
    return user.email.split("@")[0];
  }

  return "Writer";
}

function isOwner(blog, user) {
  if (!user || !blog) {
    return false;
  }

  if (user.uid === ADMIN_UID) {
    return true;
  }

  const currentName = getAuthorName(user).trim().toLowerCase();
  const blogAuthorId = blog.authorId?.trim();
  const blogAuthorName = blog.authorName?.trim().toLowerCase();

  if (blogAuthorId && blogAuthorId === user.uid) {
    return true;
  }

  if (!blogAuthorId && blogAuthorName && blogAuthorName === currentName) {
    return true;
  }

  return false;
}

function getStoredAuthorEmailMap() {
  try {
    return JSON.parse(localStorage.getItem("authorEmailMap") || "{}");
  } catch {
    return {};
  }
}

function saveStoredAuthorEmailMap(map) {
  localStorage.setItem("authorEmailMap", JSON.stringify(map));
}

function getLikedBlogMap(blogs, email) {
  if (!email) {
    return {};
  }

  const normalizedEmail = email.trim().toLowerCase();

  return blogs.reduce((likedMap, blog) => {
    if (blog.likedByEmails?.includes(normalizedEmail)) {
      likedMap[blog._id] = true;
    }

    return likedMap;
  }, {});
}

function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [likedBlogs, setLikedBlogs] = useState({});
  const [likingBlogs, setLikingBlogs] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user || null);

      if (user?.email) {
        const authorMap = getStoredAuthorEmailMap();
        authorMap[`id:${user.uid}`] = user.email;
        const authorName = getAuthorName(user);
        if (authorName) {
          authorMap[`name:${authorName.trim().toLowerCase()}`] = user.email;
        }
        saveStoredAuthorEmailMap(authorMap);
      }
    });

    fetchBlogs();

    return unsubscribe;
  }, []);

  useEffect(() => {
    setLikedBlogs(getLikedBlogMap(blogs, currentUser?.email || ""));
  }, [blogs, currentUser]);

  const fetchBlogs = () => {
    axios
      .get(`${API_BASE_URL}/api/blogs`)
      .then((res) => {
        setBlogs(res.data.reverse());
      })
      .catch(() => {
        console.log("Error fetching data");
      });
  };

  const handleLike = async (blogId) => {
    if (!currentUser?.email) {
      window.alert("Please sign in to like a blog.");
      return;
    }

    if (likedBlogs[blogId] || likingBlogs[blogId]) {
      return;
    }

    setLikingBlogs((prev) => ({ ...prev, [blogId]: true }));
    setLikedBlogs((prev) => ({ ...prev, [blogId]: true }));
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === blogId ? { ...blog, likes: blog.likes + 1 } : blog
      )
    );

    try {
      await axios.patch(`${API_BASE_URL}/api/blogs/like/${blogId}`, {
        authorEmail: currentUser.email,
      });
    } catch (error) {
      if (error.response?.status === 409) {
        window.alert("This email has already liked this blog.");
      } else {
        setLikedBlogs((prev) => {
          const updatedLikes = { ...prev };
          delete updatedLikes[blogId];
          return updatedLikes;
        });
        setBlogs((prevBlogs) =>
          prevBlogs.map((blog) =>
            blog._id === blogId ? { ...blog, likes: Math.max(blog.likes - 1, 0) } : blog
          )
        );
        console.error("Error liking the blog post:", error);
      }
    } finally {
      setLikingBlogs((prev) => {
        const updatedLikes = { ...prev };
        delete updatedLikes[blogId];
        return updatedLikes;
      });
    }
  };

  const resetForm = () => {
    setNewTitle("");
    setNewContent("");
    setEditingBlogId(null);
  };

  const handleStartEdit = (blog) => {
    setNewTitle(blog.newTitle);
    setNewContent(blog.newContent);
    setEditingBlogId(blog._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteBlog = async (blogId) => {
    if (!currentUser) {
      window.alert("Please sign in to delete a blog.");
      return;
    }

    const confirmed = window.confirm("Delete this blog permanently?");
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/blogs/${blogId}`, {
        data: {
          authorId: currentUser.uid,
          authorName: getAuthorName(currentUser),
          authorEmail: currentUser.email,
        },
      });

      if (editingBlogId === blogId) {
        resetForm();
      }

      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      window.alert(error.response?.data?.message || "Unable to delete this blog.");
    }
  };

  const handleNewBlogSubmit = (event) => {
    event.preventDefault();

    if (!currentUser) {
      window.alert("Please sign in to add or edit blogs.");
      return;
    }

    const authorId = currentUser.uid;
    const authorName = getAuthorName(currentUser);
    const authorEmail = currentUser.email;
    const authorMap = getStoredAuthorEmailMap();
    authorMap[`id:${authorId}`] = authorEmail;
    authorMap[`name:${authorName.trim().toLowerCase()}`] = authorEmail;
    saveStoredAuthorEmailMap(authorMap);

    if (editingBlogId) {
      axios
        .put(`${API_BASE_URL}/api/blogs/${editingBlogId}`, {
          newTitle,
          newContent,
          authorId,
          authorName,
          authorEmail,
        })
        .then(() => {
          fetchBlogs();
          resetForm();
        })
        .catch((error) => {
          window.alert(error.response?.data?.message || "Unable to update this blog.");
        });
      return;
    }

    const date = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    axios
      .post(`${API_BASE_URL}/api/blogs`, {
        newTitle,
        date,
        newContent,
        likes: 0,
        authorId,
        authorName,
        authorEmail,
      })
      .then(() => {
        fetchBlogs();
        resetForm();
      })
      .catch((error) => {
        window.alert(error.response?.data?.message || "Unable to add this blog.");
      });
  };

  const canManageBlog = (blog) => isOwner(blog, currentUser);
  const currentAuthorName = getAuthorName(currentUser);
  const isAdmin = currentUser?.uid === ADMIN_UID;
  const visibleBlogs = isAdmin ? blogs : blogs.filter((blog) => canManageBlog(blog));

  const getDisplayEmail = (blog) => {
    if (blog.authorEmail?.trim()) {
      return blog.authorEmail;
    }

    const authorMap = getStoredAuthorEmailMap();
    if (blog.authorId?.trim() && authorMap[`id:${blog.authorId.trim()}`]) {
      return authorMap[`id:${blog.authorId.trim()}`];
    }
    if (blog.authorName?.trim() && authorMap[`name:${blog.authorName.trim().toLowerCase()}`]) {
      return authorMap[`name:${blog.authorName.trim().toLowerCase()}`];
    }

    return currentUser?.email || "No email";
  };

  return (
    <div className="text-[#14261c]">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-6 md:px-5 md:pt-10">
        <div className="rounded-[28px] border border-[#ddd4c7] bg-[#fffaf3]/75 px-5 py-8 shadow-[0_24px_60px_rgba(36,43,39,0.08)] backdrop-blur sm:px-8 sm:py-10 md:rounded-[36px] md:px-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8c7c63] sm:text-xs sm:tracking-[0.5em]">
                Modern editorial archive
              </p>
              <h1 className="max-w-4xl text-4xl leading-[0.96] sm:text-5xl md:text-7xl lg:text-8xl">
                Explore stories, notes, and ideas shaped for careful reading.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#55615a] md:mt-6 md:leading-8">
                {isAdmin
                  ? "Admin access enabled. You can manage every blog on the platform."
                  : "Signed-in users can create blogs and manage only their own posts here."}
              </p>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#e6ddcf] bg-[#f7f2e9] sm:rounded-[28px]">
              <img
                src={img1}
                alt="Editorial archive illustration"
                className="h-[360px] w-full object-cover object-center sm:h-[440px] lg:h-[620px]"
              />
            </div>
          </div>
        </div>
      </section>

      {currentUser ? (
        <section className="mx-auto max-w-5xl px-4 pb-12 md:px-5">
          <div className="overflow-hidden rounded-[28px] border border-[#ddd4c7] bg-[#fffaf4] md:rounded-[34px]">
            <div className="flex flex-col gap-4 border-b border-[#ece4d8] px-5 py-6 sm:px-8 sm:py-7 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4 sm:items-center">
                <div className="rounded-full bg-[#173124] p-3 text-white">
                  <FiEdit3 />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl">{editingBlogId ? "Edit Blog" : "Write New Blog"}</h2>
                  <p className="mt-1 text-sm text-[#6d746c]">
                    {editingBlogId
                      ? "Make changes to the selected post and save them."
                      : `Signed in as ${currentAuthorName}. ${isAdmin ? "Admin can manage every blog." : "You can publish your own blogs from here."}`}
                  </p>
                  <p className="mt-2 break-all text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8c7c63] sm:text-xs sm:tracking-[0.24em]">
                    {currentAuthorName} &bull; {currentUser.email}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-[#edf2ed] px-4 py-2 text-sm text-[#173124]">
                {editingBlogId ? "Editing selected post" : isAdmin ? "Admin tools enabled" : "Writer tools enabled"}
              </span>
            </div>

            <form onSubmit={handleNewBlogSubmit} className="flex flex-col gap-8 p-5 sm:p-8">
              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#6d746c]">
                  Blog Title
                </label>
                <input
                  type="text"
                  placeholder="Write an engaging title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="mt-3 w-full border-b border-[#cfc5b7] bg-transparent py-4 text-2xl outline-none placeholder:text-[#aa9f90] focus:border-[#173124] sm:text-4xl"
                  required
                />
              </div>

              <div>
                <label className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#6d746c]">
                  Blog Content
                </label>
                <textarea
                  placeholder="Start writing your story..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows="12"
                  className="mt-4 w-full resize-none rounded-[22px] border border-[#ddd4c7] bg-white p-4 text-base leading-8 outline-none placeholder:text-[#9ba39d] focus:border-[#173124] sm:rounded-[28px] sm:p-6 sm:text-lg sm:leading-9"
                  required
                />
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="rounded-full bg-[#173124] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-1"
                >
                  {editingBlogId ? "Update Blog" : "Publish Blog"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border border-[#173124] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#173124] transition-all duration-300 hover:bg-[#173124] hover:text-white"
                >
                  {editingBlogId ? "Cancel Edit" : "Clear Form"}
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : (
        <section className="mx-auto max-w-5xl px-4 pb-12 md:px-5">
          <div className="rounded-[30px] border border-[#ddd4c7] bg-[#fffaf4]/80 px-8 py-6 text-[#55615a] shadow-[0_16px_40px_rgba(36,43,39,0.08)]">
            Sign in to add blogs and manage your own posts. The admin account can manage every blog.
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-16 md:px-5">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#8c7c63]">Archive</p>
            <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl">Browse the collection</h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-[#55615a]">
            {isAdmin
              ? "Admin is viewing every blog in the system."
              : "Regular users see only the blogs they created here."}
          </p>
        </div>

        {!currentUser ? (
          <div className="rounded-[30px] border border-[#ddd4c7] bg-[#fffaf4]/80 px-8 py-6 text-[#55615a] shadow-[0_16px_40px_rgba(36,43,39,0.08)]">
            Sign in to view your blogs. The admin account can view and manage every post.
          </div>
        ) : visibleBlogs.length === 0 ? (
          <div className="rounded-[30px] border border-[#ddd4c7] bg-[#fffaf4]/80 px-8 py-6 text-[#55615a] shadow-[0_16px_40px_rgba(36,43,39,0.08)]">
            {isAdmin
              ? "No blogs found yet. Use the form above to publish the first post."
              : "You haven't added any blogs yet. Use the form above to publish your first post."}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {visibleBlogs.map((blog, index) => (
              <article
                key={blog._id}
                className={`overflow-hidden rounded-[30px] border transition-all duration-500 hover:-translate-y-2 ${
                  index % 3 === 0
                    ? "border-[#315241] bg-[#173124] text-white shadow-[0_22px_55px_rgba(23,49,36,0.22)]"
                    : "border-[#ddd4c7] bg-white/75"
                }`}
              >
                <div className={`p-8 ${index % 3 === 0 ? "" : "border-b border-[#ece4d8]"}`}>
                  <div
                    className={`mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] sm:gap-3 sm:tracking-[0.26em] ${
                      index % 3 === 0 ? "text-[#b9cdc1]" : "text-[#8c7c63]"
                    }`}
                  >
                    <span>{blog.authorName || "Editorial Guest"}</span>
                    <span>&bull;</span>
                    <span className="normal-case tracking-normal">{getDisplayEmail(blog)}</span>
                  </div>
                  <div
                    className={`mb-6 flex items-center gap-3 text-sm ${
                      index % 3 === 0 ? "text-[#d6e1db]" : "text-[#6d746c]"
                    }`}
                  >
                    <FiClock />
                    <span>{blog.date}</span>
                  </div>

                  <h3 className="text-3xl leading-snug">{blog.newTitle}</h3>
                  <p
                    className={`mt-6 text-lg leading-8 ${
                      index % 3 === 0 ? "text-[#dce7e1]" : "text-[#55615a]"
                    }`}
                  >
                    {blog.newContent.length > 250 ? `${blog.newContent.substring(0, 250)}...` : blog.newContent}
                  </p>
                </div>

                <div className="flex flex-col gap-4 px-6 py-6 sm:px-8 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      onClick={() => handleLike(blog._id)}
                      disabled={Boolean(likedBlogs[blog._id] || likingBlogs[blog._id])}
                      className={`flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                        likedBlogs[blog._id] ? "cursor-not-allowed opacity-70" : "hover:scale-105"
                      } ${index % 3 === 0 ? "text-white" : "text-[#173124]"}`}
                    >
                      {likedBlogs[blog._id] ? <FaHeart className="text-lg text-[#d84b6a]" /> : <FiHeart className="text-lg" />}
                      Like
                    </button>

                    {canManageBlog(blog) ? (
                      <button
                        onClick={() => handleStartEdit(blog)}
                        className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 hover:scale-105 ${
                          index % 3 === 0 ? "text-[#dce7e1]" : "text-[#173124]"
                        }`}
                      >
                        <FiEdit3 className="text-lg" />
                        Edit
                      </button>
                    ) : null}
                  </div>

                  <div className={`flex flex-wrap items-center gap-3 ${index % 3 === 0 ? "text-[#d6e1db]" : "text-[#6d746c]"}`}>
                    <FiBookOpen />
                    <span>{blog.likes} Likes</span>

                    {canManageBlog(blog) ? (
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className={`ml-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 hover:scale-105 ${
                          index % 3 === 0 ? "text-[#f2c8c8]" : "text-[#9e3d3d]"
                        }`}
                      >
                        <FiTrash2 className="text-lg" />
                        Delete
                      </button>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Blogs;
