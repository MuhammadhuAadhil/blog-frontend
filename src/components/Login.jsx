import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import auth from "../config/firebase";
import loginImage from "../assets/pen.jpeg"


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    window.scrollTo(0, 0);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.replace("/home");
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setErr("");

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/home");
      })
      .catch(() => {
        setErr("Incorrect email or password. Please try again.");
      });
  };

  const handleGoogleLogin = async () => {
    setErr("");

    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home");
    } catch (error) {
      setErr(error.code === "auth/popup-closed-by-user" ? "Google sign-in was cancelled." : "Unable to continue with Google right now.");
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
        <span className="mt-1 text-sm font-semibold text-[#173124]">Sign in with Google</span>
      </span>
    </>
  );

  return (
    <section className="px-4 py-6 md:px-5 md:py-10">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] bg-[linear-gradient(145deg,_#173124_0%,_#274735_100%)] p-6 text-white shadow-[0_28px_60px_rgba(23,49,36,0.24)] sm:p-8 md:rounded-[34px] md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#c7d5ce]">
            Welcome back
          </p>
          <h1 className="mt-6 text-4xl leading-[0.95] sm:text-5xl md:text-6xl">Sign in to continue writing and managing your journal.</h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#d7e2dc] md:leading-8">
            Access your editorial dashboard, publish new posts, and keep your blog experience polished across every page.
          </p>
          <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10">
            <img
              src={loginImage}
              alt="Writer workspace for sign in page"
              className="h-64 w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,49,36,0.08)_0%,rgba(23,49,36,0.52)_100%)]" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#dfe7e1]">Sign in</p>
              <p className="mt-3 max-w-xs text-2xl leading-tight">
                Pick up your writing flow and continue where you left off.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#ddd4c7] bg-[#fffaf4]/80 shadow-[0_24px_60px_rgba(36,43,39,0.08)] backdrop-blur md:rounded-[34px]">
          <div className="p-6 sm:p-8 md:p-10">
            <h2 className="text-3xl text-[#14261c] sm:text-4xl md:text-5xl">Login</h2>
            <p className="mt-3 text-[#667067]">Use your account credentials to enter your writing and publishing workspace.</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-6">
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

              {err ? <p className="text-sm text-red-600">{err}</p> : null}

              <button
                type="submit"
                className="w-full rounded-full bg-[#173124] px-6 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-1"
              >
                Login
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
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-4 rounded-[28px] border border-[#d3b78e] bg-[linear-gradient(135deg,_#f2e4cc_0%,_#e8d4ae_48%,_#dcc194_100%)] px-6 py-4 text-sm font-semibold shadow-[0_18px_36px_rgba(141,112,67,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_42px_rgba(141,112,67,0.24)]"
              >
                {googleButton}
              </button>
            </div>

            <p className="mt-6 text-sm text-[#55615a]">
              New here?{" "}
              <button
                type="button"
                className="font-semibold text-[#173124]"
                onClick={() => navigate("/signup")}
              >
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
