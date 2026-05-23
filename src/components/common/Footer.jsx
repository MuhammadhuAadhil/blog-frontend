import React, { useState } from "react";
import { Link } from "react-router-dom";

function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      window.alert("Please enter your email address.");
      return;
    }

    window.location.href = `mailto:hello@editorialblog.dev?subject=Newsletter Subscription&body=Please subscribe this email: ${encodeURIComponent(
      trimmedEmail
    )}`;
  };

  return (
    <footer className="mt-10 border-t border-[#2f5240] bg-[#10251b] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-5">
        <div className="grid gap-10 border-b border-[#315241] pb-10 md:grid-cols-[1.4fr_0.8fr_1fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.4em] text-[#b8c8bf]">
              Editorial Journal
            </p>
            <h2 className="mb-4 text-3xl leading-tight sm:text-4xl md:text-5xl md:leading-none">Thoughtful stories for curious builders.</h2>
            <p className="max-w-xl text-sm leading-7 text-[#c8d4cd]">
              A calm space for frontend notes, product reflections, and practical lessons from building on the web.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#b8c8bf]">
              Explore
            </h3>
            <div className="space-y-3 text-sm text-[#e6efe9]">
              <Link className="block transition-all duration-300 hover:translate-x-1" to="/home">
                Home
              </Link>
              <Link className="block transition-all duration-300 hover:translate-x-1" to="/blogs">
                Blogs
              </Link>
              <Link className="block transition-all duration-300 hover:translate-x-1" to="/about">
                About
              </Link>
              <Link className="block transition-all duration-300 hover:translate-x-1" to="/contact">
                Contact
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#b8c8bf]">
              Newsletter
            </h3>
            <p className="mb-4 text-sm leading-7 text-[#c8d4cd]">
              New essays, interface ideas, and writing updates in one thoughtful digest.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-[#4e705f] bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-[#a9bbb0] focus:border-white"
              />
              <button
                type="button"
                onClick={handleSubscribe}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#173124] transition-all duration-300 hover:bg-[#e9efe9]"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-6 text-sm text-[#c8d4cd] md:flex-row">
          <p>© 2026 Editorial Blog Platform. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-5 md:justify-end">
            <Link to="/about">Privacy</Link>
            <Link to="/about">Terms</Link>
            <a href="mailto:hello@editorialblog.dev?subject=Support Request">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
