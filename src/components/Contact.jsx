import React, { useEffect } from "react";
import Footer from "./common/Footer";
import contactImage from "../assets/book.jpeg"


function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-5 md:pt-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[28px] bg-[linear-gradient(145deg,_#173124_0%,_#244635_100%)] p-6 text-white sm:p-8 md:rounded-[34px] md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.48em] text-[#c7d5ce]">Contact</p>
            <h1 className="mt-6 text-4xl leading-[0.95] sm:text-5xl md:text-6xl">Let&apos;s talk about design, frontend work, or the next article.</h1>
            <p className="mt-6 text-base leading-7 text-[#d7e2dc] md:leading-8">
              Reach out for collaboration, questions, or feedback on the project. This page now matches the rest of the editorial system visually, even before a real contact form is added.
            </p>
          </div>

          <div className="rounded-[28px] border border-[#ddd4c7] bg-[#fffaf4]/80 p-6 shadow-[0_24px_60px_rgba(36,43,39,0.08)] backdrop-blur sm:p-8 md:rounded-[34px] md:p-10">
            <h2 className="text-3xl text-[#14261c] sm:text-4xl md:text-5xl">Get in touch</h2>
            <div className="mt-8 space-y-5 text-[#55615a]">
              <p>Email: hello@editorialblog.dev</p>
              <p>Response time: usually within 2 business days</p>
              <p>Topics: technology, programming, web development, lifestyle, travel stories, productivity tips, and personal experiences</p>
            </div>

            <div className="mt-8 overflow-hidden rounded-[24px] border border-[#e2d8ca]">
              <img
                src={contactImage}
                alt="Creative team discussion"
                className="h-56 w-full object-cover object-center sm:h-64"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Contact;
