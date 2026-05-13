import { useEffect, useState, type CSSProperties } from "react";
import portrait from "../../assets/IMG_0267.JPG";
import designResume from "../../assets/Design Resume.jpg";
import resumeSpringPdf from "../../assets/Resume Spring 26'.pdf";
import instaIcon from "../../assets/insta.svg";
import emailIcon from "../../assets/email.svg";
import linkedinIcon from "../../assets/linkedin.svg";

const bgMods = import.meta.glob<string>("../../assets/IMG_2518.JPG", {
  eager: true,
  import: "default",
});
const bgUrl = Object.values(bgMods)[0];

export default function About() {
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => {
    if (!resumeOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setResumeOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [resumeOpen]);

  return (
    <div className="figma-page">
      <div
        className="figma-bg"
        style={
          bgUrl
            ? ({
                ["--figma-bg" as string]: `url(${bgUrl})`,
              } as CSSProperties)
            : undefined
        }
      />

      <div className="figma-stage figma-about">
        <div className="about__top">
          <div className="about__media">
            <img
              className="about__portrait"
              src={portrait}
              alt="Madison Dempsey"
              loading="eager"
              decoding="async"
            />
          </div>
          <section className="about__bio" aria-label="About Madison Dempsey">
            <div className="about__body">
              <p className="about__p">
                Hi, I&apos;m Madison Dempsey, a graphic design student pursuing my
                BFA with a minor in industrial design at the University of
                Tennessee, graduating in 2028. I have experience with Adobe
                Creative Suite, Procreate, Figma, Cursor, and more, with a
                background in yearbook design, sorority graphics, and personal
                creative projects.
              </p>
              <p className="about__p">
                Outside of design, I serve as Director of Service and Philanthropy
                for the Pi Beta Phi TN Gamma chapter, where I organize fundraising,
                service opportunities, and philanthropy events. When I&apos;m not
                designing, you can usually find me outside playing pickleball or
                tennis, reading, crafting, or spending time with friends and
                family.
              </p>
            </div>

            <div className="about__footer-row">
              <button
                type="button"
                className="about__resume-btn"
                onClick={() => setResumeOpen(true)}
              >
                View resume
              </button>

              <div className="about__icons" aria-label="Social links">
              <a
                className="about__icon-link"
                href="https://www.instagram.com/m.h.d_designs/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img
                  className="about__icon"
                  src={instaIcon}
                  alt=""
                  width={45}
                  height={51}
                />
              </a>
              <a
                className="about__icon-link"
                href="mailto:mhdemps1@gmail.com"
                aria-label="Email"
              >
                <img
                  className="about__icon"
                  src={emailIcon}
                  alt=""
                  width={45}
                  height={51}
                />
              </a>
              <a
                className="about__icon-link"
                href="https://www.linkedin.com/in/madison-dempsey-designs/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <img
                  className="about__icon"
                  src={linkedinIcon}
                  alt=""
                  width={45}
                  height={51}
                />
              </a>
              </div>
            </div>
          </section>
        </div>
      </div>

      {resumeOpen ? (
        <div
          className="resume-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Design resume"
        >
          <button
            type="button"
            className="resume-modal__backdrop"
            onClick={() => setResumeOpen(false)}
            aria-label="Close resume"
          />
          <div className="resume-modal__panel">
            <div className="resume-modal__toolbar">
              <a
                className="resume-modal__download"
                href={resumeSpringPdf}
                download="Resume-Spring-26.pdf"
              >
                Download (Spring &apos;26)
              </a>
              <button
                type="button"
                className="resume-modal__close"
                onClick={() => setResumeOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="resume-modal__scroll">
              <img
                className="resume-modal__img"
                src={designResume}
                alt="Madison Dempsey design resume"
                loading="eager"
                decoding="async"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
