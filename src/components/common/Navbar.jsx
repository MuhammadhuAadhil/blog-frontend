import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import auth from "../../config/firebase";
import { signOut } from "firebase/auth";
import logo from "../../assets/logo.jpeg";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navItems = [
    { label: "Home", to: "/home" },
    { label: "Blogs", to: "/blogs" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoggedIn(Boolean(user));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  function logout() {
    signOut(auth);
  }

  const activeIndex = Math.max(
    navItems.findIndex((item) => location.pathname === item.to),
    0
  );
  const isSignupPage = location.pathname === "/signup";
  const isLoginPage = location.pathname === "/login";
  const authButtonBase =
    "rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300";
  const authButtonBaseMobile =
    "rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300";
  const registerActiveClass =
    "border border-[#d6bea0] bg-[#fbf4ea] text-[#173124] shadow-[0_0_0_3px_rgba(233,209,173,0.32),0_14px_28px_rgba(92,73,44,0.12)]";
  const registerInactiveClass =
    "border border-[#cfc5b7] bg-white/50 text-[#173124] hover:border-[#173124] hover:bg-[#fffaf2]";
  const loginActiveClass =
    "border border-[#2d7652] bg-[#2d7652] text-white shadow-[0_0_0_3px_rgba(45,118,82,0.18),0_14px_28px_rgba(45,118,82,0.2)]";
  const loginInactiveClass =
    "border border-[#173124] bg-[#173124] text-white shadow-[0_14px_30px_rgba(23,49,36,0.16)] hover:bg-[#234734]";

  const navLinkClass = ({ isActive }) =>
    `relative z-10 flex items-center justify-center rounded-full px-4 py-2.5 text-center transition-all duration-300 ${
      isActive
        ? "text-[#173124]"
        : "text-[#675f55] hover:text-[#173124]"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[#d5cab8] bg-[#f3ebe1]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-5">
        <button
          type="button"
          className="flex items-center gap-3 text-left"
          onClick={() => navigate("/home")}
        >
          <img
            src={logo}
            alt="Editorial logo"
            className="h-12 w-12 rounded-2xl object-cover shadow-[0_8px_20px_rgba(23,49,36,0.12)] sm:h-14 sm:w-14"
          />
          <span>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.45em] text-[#887d70]">
              Journal Studio
            </span>
            <span className="text-3xl leading-none text-[#173124] sm:text-4xl">Editorial</span>
          </span>
        </button>

        <nav className="relative hidden w-full max-w-[460px] grid-cols-4 gap-2 rounded-full border border-[#e1d4c2] bg-[#fcf6ed] p-2 text-xs font-semibold uppercase tracking-[0.32em] md:grid">
          <span
            aria-hidden="true"
            className="absolute top-2 h-[calc(100%-16px)] rounded-full border border-[#cab79a] bg-[#fffaf2] shadow-[0_8px_22px_rgba(92,73,44,0.08)] transition-all duration-300"
            style={{
              width: "calc((100% - 22px) / 4)",
              left: `calc(8px + ${activeIndex} * ((100% - 22px) / 4 + 2px))`,
            }}
          />
          {navItems.map((item) => (
            <NavLink key={item.to} className={navLinkClass} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-full border border-[#cfc5b7] px-4 py-2 text-sm font-semibold text-[#173124] transition-all duration-300 hover:bg-[#eadfce] md:hidden"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <div className="hidden items-center gap-3 md:flex">
          {loggedIn ? (
            <button
              onClick={logout}
              className="rounded-full border border-[#173124] px-5 py-2 text-sm font-semibold text-[#173124] transition-all duration-300 hover:bg-[#173124] hover:text-white"
            >
              Sign out
            </button>
          ) : (
            <>
            <button
              onClick={() => navigate("/signup")}
              className={`hidden sm:block ${authButtonBase} ${
                isSignupPage ? registerActiveClass : registerInactiveClass
              }`}
            >
              Register
            </button>
            <button
              onClick={() => navigate("/login")}
              className={`${authButtonBase} ${
                isLoginPage ? loginActiveClass : loginInactiveClass
              }`}
            >
              Sign in
            </button>
            </>
          )}
        </div>

        {menuOpen ? (
          <div className="w-full rounded-[28px] border border-[#e1d4c2] bg-[#fcf6ed] p-4 shadow-[0_16px_35px_rgba(92,73,44,0.08)] md:hidden">
            <nav className="grid gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#173124]">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-3 text-center transition-all duration-300 ${
                      isActive
                        ? "bg-[#fffaf2] text-[#173124] shadow-[0_8px_22px_rgba(92,73,44,0.08)]"
                        : "text-[#675f55] hover:bg-[#f6ede1] hover:text-[#173124]"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 grid gap-3">
              {loggedIn ? (
                <button
                  onClick={logout}
                  className="rounded-full border border-[#173124] px-5 py-3 text-sm font-semibold text-[#173124] transition-all duration-300 hover:bg-[#173124] hover:text-white"
                >
                  Sign out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/signup")}
                    className={`${authButtonBaseMobile} ${
                      isSignupPage ? registerActiveClass : registerInactiveClass
                    }`}
                  >
                    Register
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className={`${authButtonBaseMobile} ${
                      isLoginPage ? loginActiveClass : loginInactiveClass
                    }`}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default Navbar;
