import { Link } from "react-router-dom";
import { about } from "../content/about";
import Seo from "../components/Seo";
import Balatro from "../components/Balatro";
import { ArrowRightIcon } from "../components/Icons";

//About / CV page. All copy lives in src/content/about.js; this file is layout.
//
//One Balatro accent on the whole page: a tone-on-tone plum swirl behind the
//"why this site" panel, dimmed so it reads as texture under the text. The
//rest of the page is type, white cards and plum tints.

const ACCENT_SWIRL = {
  color1: "#2b0042",
  color2: "#5a1f86",
  color3: "#14001f",
  contrast: 2,
  lighting: 0.25,
  swirl: 0.6,
  pixelSize: 1,
  speed: 0.4,
  mouseInteraction: false,
  clickSwirl: false,
  intro: false,
  maxDevicePixelRatio: 1.5,
};

const icon = "h-4 w-4 shrink-0";
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={icon} aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={icon} aria-hidden="true">
    <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={icon} aria-hidden="true">
    <path d="M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2ZM8 19H5V9.5h3V19ZM6.5 8.2a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM19 19h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4V19h-3V9.5h2.9v1.3a3.2 3.2 0 0 1 2.8-1.5c3 0 3.6 2 3.6 4.6V19Z" />
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={icon} aria-hidden="true">
    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  </svg>
);
const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
    <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </svg>
);

const initials = (name) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

const SectionHeading = ({ id, children }) => (
  <h2 id={id} className="mb-5 font-display text-3xl leading-none tracking-tight text-white sm:text-4xl">{children}</h2>
);

const Chip = ({ children }) => (
  <li className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-sm text-white/85">{children}</li>
);

//Small label on a white card.
const Tag = ({ children }) => (
  <li className="rounded bg-plum/10 px-2 py-0.5 text-xs font-medium text-plum">{children}</li>
);

const contactLink = "inline-flex items-center gap-2 text-white/85 transition-colors hover:text-white hover:underline";

const About = () => {
  const { name, tagline, photo, location, facts, links, story, whyThisSite, experience, education, projects, skills } = about;

  return (
    <div className="max-w-6xl">
      <Seo title="About me" description={tagline ? `${name}. ${tagline}` : name} image={photo} />
      {/* HERO */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {photo ? (
          <img src={photo} alt={name} className="h-28 w-28 shrink-0 rounded-full border border-white/30 object-cover" />
        ) : (
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-white/30 bg-plum font-display text-4xl text-white">
            {initials(name)}
          </div>
        )}
        <div>
          <h1 className="font-display text-5xl leading-none tracking-tight text-white sm:text-6xl">{name}</h1>
          {tagline && <p className="mt-2 text-xl text-white/75">{tagline}</p>}
          {location && <p className="mt-2 text-sm text-white/60">{location}</p>}
          <ul className="mt-4 flex flex-wrap gap-2">
            {facts.map((f) => <Chip key={f}>{f}</Chip>)}
          </ul>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {links.github && (
          <a href={links.github} target="_blank" rel="noreferrer" className="btn btn-secondary"><GitHubIcon /> GitHub</a>
        )}
        {links.linkedin && (
          <a href={links.linkedin} target="_blank" rel="noreferrer" className="btn btn-secondary"><LinkedInIcon /> LinkedIn</a>
        )}
        {links.resume && (
          <a href={links.resume} download className="btn btn-primary">
            <DownloadIcon /> Download resume
          </a>
        )}
      </div>

      <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* MAIN COLUMN */}
        <div className="space-y-16">
          <section aria-labelledby="about-story">
            <SectionHeading id="about-story">A bit about me</SectionHeading>
            <div className="max-w-prose space-y-4 text-lg leading-relaxed text-white/85">
              {story.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>

          <section aria-labelledby="about-why" className="panel relative isolate overflow-hidden p-6 text-white sm:p-8">
            <div className="absolute inset-0 -z-10 opacity-70" aria-hidden="true">
              <Balatro {...ACCENT_SWIRL} />
            </div>
            <h2 id="about-why" className="font-display text-3xl leading-none tracking-tight sm:text-4xl">{whyThisSite.heading}</h2>
            <div className="mt-4 max-w-prose space-y-4 leading-relaxed text-white/90">
              {whyThisSite.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <Link to={whyThisSite.cta.to} className="btn btn-primary mt-6">
              {whyThisSite.cta.label}
              <ArrowRightIcon />
            </Link>
          </section>

          <section aria-labelledby="about-experience">
            <SectionHeading id="about-experience">Experience</SectionHeading>
            <ol className="space-y-8 border-l border-white/15 pl-6">
              {experience.map((job) => (
                <li key={`${job.company}-${job.role}`} className="relative">
                  <span className="absolute -left-[30.5px] top-1.5 h-3 w-3 rounded-full bg-white" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-white">{job.role}</h3>
                  <p className="text-white/65">
                    {job.company}{job.period && <span className="text-white/50"> · {job.period}</span>}
                  </p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-white/80 marker:text-white/40">
                    {job.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="about-projects">
            <SectionHeading id="about-projects">Projects</SectionHeading>
            <ul className="grid gap-5 sm:grid-cols-2">
              {projects.map((p) => (
                <li key={p.name} className="card flex flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{p.name}</h3>
                      {p.tagline && <p className="text-sm text-black/55">{p.tagline}</p>}
                    </div>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-black/70 hover:text-black hover:underline"
                        aria-label={`${p.name} on GitHub`}
                      >
                        Code <ExternalIcon />
                      </a>
                    )}
                  </div>
                  <ul className="mt-3 flex-1 list-disc space-y-1.5 pl-5 text-sm text-black/75 marker:text-black/40">
                    {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  {p.stack?.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => <Tag key={s}>{s}</Tag>)}
                    </ul>
                  )}
                </li>
              ))}
              <li className="flex items-center justify-center rounded-2xl border border-dashed border-white/25 p-5 text-center text-sm text-white/60">
                More projects are in the works. Check back soon, or watch my GitHub.
              </li>
            </ul>
          </section>

          <section aria-labelledby="about-education">
            <SectionHeading id="about-education">Education</SectionHeading>
            <div className="card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-black">{education.school}</h3>
                <span className="text-sm text-black/55">{education.location} · {education.year}</span>
              </div>
              <p className="mt-1 text-black/75">{education.degree}</p>
              {education.coursework?.length > 0 && (
                <>
                  <p className="mt-4 text-sm font-medium text-black/55">Relevant coursework</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {education.coursework.map((c) => <Tag key={c}>{c}</Tag>)}
                  </ul>
                </>
              )}
            </div>
          </section>
        </div>

        {/* SIDE RAIL */}
        <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="about-skills">
            <h2 id="about-skills" className="font-display text-2xl text-white">Skills</h2>
            <div className="mt-4 space-y-5">
              {skills.map((s) => (
                <div key={s.group}>
                  <h3 className="text-sm font-semibold text-white/60">{s.group}</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {s.items.map((item) => (
                      <li key={item} className="rounded bg-white/10 px-2 py-0.5 text-xs font-medium text-white/85">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="about-contact" className="rounded-2xl border border-white/15 bg-white/5 p-5">
            <h2 id="about-contact" className="font-display text-2xl text-white">Get in touch</h2>
            <p className="mt-2 text-sm text-white/70">
              Open to interesting projects and full-time software roles.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {links.email && (
                <li><a href={`mailto:${links.email}`} className={contactLink}><MailIcon /> {links.email}</a></li>
              )}
              {links.github && (
                <li><a href={links.github} target="_blank" rel="noreferrer" className={contactLink}><GitHubIcon /> {links.github.replace(/^https?:\/\//, "")}</a></li>
              )}
              {links.linkedin && (
                <li><a href={links.linkedin} target="_blank" rel="noreferrer" className={contactLink}><LinkedInIcon /> {links.linkedin.replace(/^https?:\/\//, "")}</a></li>
              )}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};
export default About;
