import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import auth from "../config/firebase";
import signupImage from "../assets/clock.jpeg"


function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (auth.currentUser) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    createUserWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        await updateProfile(user, {
          displayName: name.trim(),
        });
        await signOut(auth);
        navigate("/login");
      })
      .catch(() => {
        setError("Unable to create your account right now.");
      });
  };

  const handleGoogleSignup = async () => {
    setError("");

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (error) {
      setError(error.code === "auth/popup-closed-by-user" ? "Google sign-up was cancelled." : "Unable to continue with Google right now.");
    }
  };

  const googleButton = (
    <>
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_12px_28px_rgba(16,31,24,0.16)]">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
          <path
            fill="#EA4335"
            d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.4-.2-2.1H12z"
          />
          <path
            fill="#34A853"
            d="M12 21c2.6 0 4.8-.9 6.4-2.4l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.3-4H3.5v2.5C5.1 18.9 8.2 21 12 21z"
          />
          <path
            fill="#4A90E2"
            d="M6.7 13.1c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V6.6H3.5C2.9 7.8 2.5 9.1 2.5 11s.4 3.2 1 4.4l3.2-2.3z"
          />
          <path
            fill="#FBBC05"
            d="M12 4.9c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.8 1.9 14.6 1 12 1 8.2 1 5.1 3.1 3.5 6.6l3.2 2.5c.7-2.3 2.8-4.2 5.3-4.2z"
          />
        </svg>
      </span>
      <span className="flex flex-col items-start text-left leading-none">
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#6f5a3d]">Quick Access</span>
        <span className="mt-1 text-sm font-semibold text-[#173124]">Sign up with Google</span>
      </span>
    </>
  );

  return (
    <section className="px-4 py-6 md:px-5 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[28px] border border-[#ddd4c7] bg-[#fffaf4]/80 p-6 shadow-[0_24px_60px_rgba(36,43,39,0.08)] backdrop-blur sm:p-8 md:rounded-[34px] md:p-10">
          <h1 className="text-3xl text-[#14261c] sm:text-4xl md:text-5xl">Create your account</h1>
          <p className="mt-3 text-[#667067]">Join the blog platform and start building your writing space.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-[#6d746c]">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#d8d0c2] bg-[#fbf8f2] px-5 py-4 outline-none transition-all duration-300 focus:border-[#173124]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-[#6d746c]">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-[#d8d0c2] bg-[#fbf8f2] px-5 py-4 outline-none transition-all duration-300 focus:border-[#173124]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-[#6d746c]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#d8d0c2] bg-[#fbf8f2] px-5 py-4 pr-14 outline-none transition-all duration-300 focus:border-[#173124]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6d746c] transition-colors duration-300 hover:text-[#173124]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.2em] text-[#6d746c]">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-[#d8d0c2] bg-[#fbf8f2] px-5 py-4 pr-14 outline-none transition-all duration-300 focus:border-[#173124]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6d746c] transition-colors duration-300 hover:text-[#173124]"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              className="w-full rounded-full bg-[#173124] px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-1"
            >
              Register
            </button>
          </form>

          <div className="mt-6">
            <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#8c7c63]">
              <span className="h-px flex-1 bg-[#ddd4c7]" />
              <span>or</span>
              <span className="h-px flex-1 bg-[#ddd4c7]" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex w-full items-center justify-center gap-4 rounded-[28px] border border-[#d3b78e] bg-[linear-gradient(135deg,_#f2e4cc_0%,_#e8d4ae_48%,_#dcc194_100%)] px-6 py-4 text-sm font-semibold shadow-[0_18px_36px_rgba(141,112,67,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_42px_rgba(141,112,67,0.24)]"
            >
              {googleButton}
            </button>
          </div>

          <p className="mt-6 text-sm text-[#55615a]">
            Already have an account?{" "}
            <button
              type="button"
              className="font-semibold text-[#173124]"
              onClick={() => navigate("/login")}
            >
              Login here
            </button>
          </p>
        </div>

        <div className="rounded-[28px] bg-[linear-gradient(180deg,_#e8dbc7_0%,_#dcc8ad_100%)] p-6 text-[#173124] sm:p-8 md:rounded-[34px] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#6d746c]">
            Join the studio
          </p>
          <h2 className="mt-6 text-4xl leading-[0.95] sm:text-5xl md:text-6xl">Set up your account and start publishing thoughtful blog posts.</h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#435048] md:leading-8">
            The refreshed interface gives the project a premium editorial feel, with better spacing and cleaner structure for writing and reading articles.
          </p>
          <div className="relative mt-8 overflow-hidden rounded-[28px] border border-[#ccb999]">
            <img
              src={signupImage}
              alt="Creative planning desk for signup page"
              className="h-72 w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,49,36,0.04)_0%,rgba(23,49,36,0.42)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#eef3ee]">Create account</p>
              <p className="mt-3 max-w-xs text-2xl leading-tight">
                Start your writing journey with a calm, focused space for publishing articles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Signup;
