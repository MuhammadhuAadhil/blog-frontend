import React, { useEffect } from "react";
import Footer from "./common/Footer";
import workspaceImage from "../assets/Just pace_.jpeg";
import aboutImage from "../assets/abou.jpeg"

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-6 md:px-5 md:pt-10">
        <div className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="rounded-[28px] border border-[#ddd4c7] bg-[#fffaf4]/90 p-6 shadow-[0_24px_60px_rgba(36,43,39,0.08)] backdrop-blur sm:p-10 md:rounded-[36px] md:p-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#8c7c63] sm:text-xs sm:tracking-[0.5em]">
              About Editorial
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl leading-[0.94] sm:text-5xl md:text-7xl lg:text-8xl">
              A personal publishing space shaped around clarity, craft, and calm reading.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-[#55615a] md:mt-8 md:text-lg md:leading-8">
              This project blends blog publishing with an intentional editorial design system built for reading, managing, and publishing text-based articles.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-[#e5dbcf] bg-[#fcf5ea] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c7c63]">Focus</p>
                <p className="mt-3 text-2xl text-[#173124]">Editorial clarity</p>
                <p className="mt-2 text-sm leading-7 text-[#5f655d]">
                  Spacious reading, calm hierarchy, and steady flow for long-form posts.
                </p>
              </div>
              <div className="rounded-[24px] border border-[#e5dbcf] bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8c7c63]">Approach</p>
                <p className="mt-3 text-2xl text-[#173124]">Text-first publishing</p>
                <p className="mt-2 text-sm leading-7 text-[#5f655d]">
                  Natural tones, article-focused sections, and balanced details for readers and writers.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="overflow-hidden rounded-[30px] border border-[#ddd4c7] bg-white/80 shadow-[0_18px_45px_rgba(36,43,39,0.08)]">
              <img
                src={aboutImage}
                alt="Writing desk and editorial setup"
                className="h-full min-h-[320px] w-full object-cover object-center sm:min-h-[380px]"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
              <div className="overflow-hidden rounded-[28px] border border-[#ddd4c7] bg-[#efe2d0] shadow-[0_16px_35px_rgba(36,43,39,0.08)]">
                <img
                  src={workspaceImage}
                  alt="Creative workspace visual"
                  className="h-full min-h-[220px] w-full object-cover object-center"
                />
              </div>

              <div className="rounded-[28px] border border-[#254232] bg-[#173124] p-6 text-white shadow-[0_18px_45px_rgba(23,49,36,0.16)]">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#c7d5ce]">
                  Publishing Direction
                </p>
                <p className="mt-5 text-3xl leading-tight text-[#f5efe6]">
                  Design the platform like a calm writing desk, not just a post feed.
                </p>
                <p className="mt-5 text-sm leading-7 text-[#d7e2dc]">
                  Strong typography, thoughtful spacing, and clear structure make every post feel more premium and human.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default About;
