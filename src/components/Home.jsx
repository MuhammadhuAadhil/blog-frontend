import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "./common/Footer";
import auth from "../config/firebase";
import API_BASE_URL from "../config/api";
import { FiArrowRight, FiClock, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const heroImage =
  "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg?cs=srgb&dl=pexels-cottonbro-3747468.jpg&fm=jpg";
const showcaseImage =
  "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?cs=srgb&dl=pexels-lumn-590493.jpg&fm=jpg";

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

function getLikedBlogMap(blogs, userId) {
  if (!userId) {
    return {};
  }

  const normalizedUserId = userId.trim();

  return blogs.reduce((likedMap, blog) => {
    if (blog.likedByUserIds?.includes(normalizedUserId)) {
      likedMap[blog._id] = true;
    }

    return likedMap;
  }, {});
}

function Home() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [likedBlogs, setLikedBlogs] = useState({});
  const [likingBlogs, setLikingBlogs] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user || null);

      if (user?.email) {
        const authorMap = getStoredAuthorEmailMap();
        if (user.uid) {
          authorMap[`id:${user.uid}`] = user.email;
        }
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
    setLikedBlogs(getLikedBlogMap(blogs, currentUser?.uid || ""));
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
        authorId: currentUser.uid,
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

    if (isOwner(blog, currentUser) && currentUser?.email) {
      return currentUser.email;
    }

    return "No email";
  };

  return (
    <div className="text-[#1c241f]">
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-6 md:px-5 md:pb-14 md:pt-10">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-[#8c7c63] sm:mb-6 sm:text-xs sm:tracking-[0.5em]">
              Personal journal
            </p>
            <h1 className="max-w-4xl text-4xl leading-[0.95] text-[#122219] sm:text-5xl md:text-7xl lg:text-8xl">
              Quiet thoughts, sharp design, and stories from the digital studio.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#5f655d] md:mt-8 md:text-lg md:leading-8">
             Built for readers who enjoy technology, design, coding, and thoughtful storytelling in a minimal and modern environment.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="#latest-articles"
                className="rounded-full bg-[#173124] px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-[0_18px_40px_rgba(23,49,36,0.18)] transition-all duration-300 hover:-translate-y-1 sm:px-7 sm:py-4 sm:tracking-[0.24em]"
              >
                Explore Articles
              </a>
              <button
                type="button"
                onClick={() => navigate("/blogs")}
                className="rounded-full border border-[#173124] bg-white/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#173124] transition-all duration-300 hover:bg-[#173124] hover:text-white sm:px-7 sm:py-4 sm:tracking-[0.24em]"
              >
                Editor Notes
              </button>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[28px] border border-[#ded2c0] bg-[#fbf6ef]/80 p-5 shadow-[0_10px_30px_rgba(72,54,28,0.05)]">
                <p className="text-3xl">{blogs.length || "0"}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#8c7c63]">Published posts</p>
              </div>
              <div className="rounded-[28px] border border-[#ded2c0] bg-[#fbf6ef]/80 p-5 shadow-[0_10px_30px_rgba(72,54,28,0.05)]">
                <p className="text-3xl">{blogs.reduce((total, blog) => total + blog.likes, 0)}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#8c7c63]">Reader likes</p>
              </div>
              <div className="rounded-[28px] border border-[#ded2c0] bg-[#fbf6ef]/80 p-5 shadow-[0_10px_30px_rgba(72,54,28,0.05)]">
                <p className="text-3xl">Weekly</p>
                <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#8c7c63]">New ideas shared</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 hidden h-28 w-28 rounded-full bg-[#d9c4a0]/70 blur-3xl lg:block" />
            <div className="absolute right-6 top-0 hidden h-32 w-32 rounded-full bg-[#8ea48f]/40 blur-3xl lg:block" />

            <div className="relative overflow-hidden rounded-[28px] border border-[#315241] bg-[linear-gradient(145deg,_#173124_0%,_#1d3d2d_65%,_#2a4d3a_100%)] p-6 text-white shadow-[0_30px_70px_rgba(23,49,36,0.28)] sm:rounded-[36px] sm:p-8 md:p-10">
              <div className="mb-8 overflow-hidden rounded-[28px] border border-white/10">
                <img
                  src={heroImage}
                  alt="Editorial blog workspace"
                  className="h-56 w-full object-cover object-center opacity-90"
                />
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#c3d2cb] sm:text-xs sm:tracking-[0.35em]">
                  Featured Thought
                </p>
                <span className="rounded-full border border-[#476857] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#dce7e1] sm:text-xs sm:tracking-[0.25em]">
                  Design Memo
                </span>
              </div>

              <h2 className="mt-6 text-3xl leading-[1] sm:mt-8 sm:text-4xl md:text-5xl lg:text-6xl">
                Great design feels natural long before it feels impressive.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-[#d4e0da]">
                The modern web is not only about shipping features. It is about building rhythm, trust, and clarity so people enjoy staying with the experience.
              </p>

              <div className="mt-10 grid gap-4 rounded-[28px] border border-[#355645] bg-white/5 p-5 text-sm text-[#dce7e1] sm:grid-cols-2">
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#9cb0a5]">
                    Focus
                  </p>
                  <p className="mt-2 text-lg">Editorial UI and frontend craft</p>
                </div>
                <div>
                  <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-[#9cb0a5]">
                    Goal
                  </p>
                  <p className="mt-2 text-lg">Readable, memorable, human-centered pages</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/blogs")}
                className="mt-8 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:translate-x-2 sm:mt-10 sm:tracking-[0.22em]"
              >
                Read Article
                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="latest-articles" className="mx-auto max-w-7xl px-4 pb-16 md:px-5">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#8c7c63]">Recent posts</p>
            <h2 className="mt-4 text-4xl text-[#14261c] sm:text-5xl md:text-6xl">Latest Articles</h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-[#55615a]">
            Read the newest essays on frontend development, interface craft, creative process, and the details that make digital products feel considered.
          </p>
        </div>

        <div className="mb-10 overflow-hidden rounded-[32px] border border-[#ddd4c7] bg-[#fffaf4]/80 shadow-[0_18px_45px_rgba(36,43,39,0.08)]">
          <div className="grid items-center gap-6 md:grid-cols-[1.15fr_0.85fr]">
            <img
              src={showcaseImage}
              alt="Modern blog layout inspiration"
              className="h-64 w-full object-cover object-center sm:h-72"
            />
            <div className="p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#8c7c63]">
                Visual direction
              </p>
              <h3 className="mt-4 text-4xl leading-none text-[#14261c]">
                A warmer, image-led editorial experience.
              </h3>
              <p className="mt-4 text-base leading-8 text-[#55615a]">
                Adding imagery helps break the heavy text rhythm and gives the layout more personality without losing readability.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <article
              key={blog._id}
              className={`overflow-hidden rounded-[32px] border transition-all duration-500 hover:-translate-y-2 ${
                index === 0
                  ? "border-[#315241] bg-[#173124] text-white shadow-[0_24px_55px_rgba(23,49,36,0.2)]"
                  : "border-[#ddd4c7] bg-white/75 text-[#14261c]"
              }`}
            >
              <div className={`p-8 ${index === 0 ? "" : "border-b border-[#ece4d8]"}`}>
                <div
                  className={`mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] sm:gap-3 sm:tracking-[0.26em] ${
                    index === 0 ? "text-[#b9cdc1]" : "text-[#8c7c63]"
                  }`}
                >
                  <span>{blog.authorName || "Editorial Guest"}</span>
                  <span>&bull;</span>
                  <span className="normal-case tracking-normal">{getDisplayEmail(blog)}</span>
                </div>
                <div
                  className={`mb-6 flex items-center gap-3 text-sm ${
                    index === 0 ? "text-[#d8e4dd]" : "text-[#6d746c]"
                  }`}
                >
                  <FiClock />
                  <span>{blog.date}</span>
                </div>

                <h3 className="text-3xl leading-snug">{blog.newTitle}</h3>
                <p
                  className={`mt-5 text-base leading-8 ${
                    index === 0 ? "text-[#dce7e1]" : "text-[#56615a]"
                  }`}
                >
                  {blog.newContent.length > 160 ? `${blog.newContent.substring(0, 160)}...` : blog.newContent}
                </p>
              </div>

              <div className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <button
                  onClick={() => handleLike(blog._id)}
                  disabled={Boolean(likedBlogs[blog._id] || likingBlogs[blog._id])}
                  className={`flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] transition-all duration-300 ${
                    likedBlogs[blog._id]
                      ? "cursor-not-allowed text-[#d84b6a] opacity-100"
                      : likingBlogs[blog._id]
                        ? "cursor-progress opacity-80"
                        : "hover:scale-105"
                  } ${index === 0 && !likedBlogs[blog._id] ? "text-white" : ""} ${index !== 0 && !likedBlogs[blog._id] ? "text-[#173124]" : ""}`}
                >
                  {likedBlogs[blog._id] ? <FaHeart className="text-[#d84b6a]" /> : <FiHeart />}
                  Like
                </button>
                <span className={index === 0 ? "text-[#d4e0da]" : "text-[#6d746c]"}>{blog.likes} Likes</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
