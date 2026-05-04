import type { CSSProperties } from "react";
import portrait from "../../assets/IMG_0267.JPG";
import instaIcon from "../../assets/insta.svg";
import emailIcon from "../../assets/email.svg";
import linkedinIcon from "../../assets/linkedin.svg";

const bgMods = import.meta.glob<string>("../../assets/IMG_2518.JPG", {
  eager: true,
  import: "default",
});
const bgUrl = Object.values(bgMods)[0];

export default function About() {
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
          </section>
        </div>
      </div>
    </div>
  );
}
