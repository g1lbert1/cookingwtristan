import { Link } from "react-router-dom";
import { about } from "../content/about";
import Seo from "../components/Seo";

//About / CV page. All copy lives in src/content/about.js; this file is layout.

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
  <h2 id={id} className="mb-5 text-2xl font-bold tracking-tight text-gray-900">{children}</h2>
);

const Chip = ({ children }) => (
  <li className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700">{children}</li>
);

const linkButton = "inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-100";

const About = () => {
  const { name, tagline, photo, location, facts, links, story, whyThisSite, experience, education, projects, skills } = about;

  return (
    <div className="max-w-6xl">
      <Seo title="About me" description={tagline ? `${name}. ${tagline}` : name} image={photo} />
      {/* HERO */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {photo ? (
          <img src={photo} alt={name} className="h-28 w-28 rounded-full object-cover shadow-md" />
        ) : (
          <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-[#001357] text-3xl font-bold text-white shadow-md">
            {initials(name)}
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">{name}</h1>
          {tagline && <p className="mt-1 text-xl text-gray-600">{tagline}</p>}
          {location && <p className="mt-1 text-sm text-gray-500">{location}</p>}
          <ul className="mt-4 flex flex-wrap gap-2">
            {facts.map((f) => <Chip key={f}>{f}</Chip>)}
          </ul>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {links.github && (
          <a href={links.github} target="_blank" rel="noreferrer" className={linkButton}><GitHubIcon /> GitHub</a>
        )}
        {links.linkedin && (
          <a href={links.linkedin} target="_blank" rel="noreferrer" className={linkButton}><LinkedInIcon /> LinkedIn</a>
        )}
        {links.resume && (
          <a href={links.resume} download className={`${linkButton} border-gray-900 bg-gray-900 text-white hover:bg-gray-800`}>
            <DownloadIcon /> Download résumé
          </a>
        )}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* MAIN COLUMN */}
        <div className="space-y-14">
          <section aria-labelledby="about-story">
            <SectionHeading id="about-story">A bit about me</SectionHeading>
            <div className="space-y-4 text-lg leading-relaxed text-gray-700">
              {story.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>

          <section aria-labelledby="about-why" className="rounded-xl bg-[#001357] p-6 text-white sm:p-8">
            <h2 id="about-why" className="text-2xl font-bold tracking-tight">{whyThisSite.heading}</h2>
            <div className="mt-4 space-y-4 leading-relaxed text-white/90">
              {whyThisSite.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <Link
              to={whyThisSite.cta.to}
              className="mt-6 inline-block rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#001357] hover:bg-gray-100"
            >
              {whyThisSite.cta.label} →
            </Link>
          </section>

          <section aria-labelledby="about-experience">
            <SectionHeading id="about-experience">Experience</SectionHeading>
            <ol className="space-y-8 border-l-2 border-gray-200 pl-6">
              {experience.map((job) => (
                <li key={`${job.company}-${job.role}`} className="relative">
                  <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-[#001357]" aria-hidden="true" />
                  <h3 className="text-lg font-semibold text-gray-900">{job.role}</h3>
                  <p className="text-gray-600">
                    {job.company}{job.period && <span className="text-gray-400"> · {job.period}</span>}
                  </p>
                  <ul className="mt-3 list-disc space-y-1.5 pl-5 text-gray-700">
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
                <li key={p.name} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                      {p.tagline && <p className="text-sm text-gray-500">{p.tagline}</p>}
                    </div>
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 hover:underline"
                        aria-label={`${p.name} on GitHub`}
                      >
                        Code <ExternalIcon />
                      </a>
                    )}
                  </div>
                  <ul className="mt-3 flex-1 list-disc space-y-1.5 pl-5 text-sm text-gray-700">
                    {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                  {p.stack?.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <li key={s} className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{s}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
              <li className="flex items-center justify-center rounded-xl border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
                More projects are in the works. Check back soon, or watch my GitHub.
              </li>
            </ul>
          </section>

          <section aria-labelledby="about-education">
            <SectionHeading id="about-education">Education</SectionHeading>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-gray-900">{education.school}</h3>
                <span className="text-sm text-gray-500">{education.location} · {education.year}</span>
              </div>
              <p className="mt-1 text-gray-700">{education.degree}</p>
              {education.coursework?.length > 0 && (
                <>
                  <p className="mt-4 text-sm font-medium text-gray-500">Relevant coursework</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {education.coursework.map((c) => <Chip key={c}>{c}</Chip>)}
                  </ul>
                </>
              )}
            </div>
          </section>
        </div>

        {/* SIDE RAIL */}
        <aside className="space-y-10 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="about-skills">
            <h2 id="about-skills" className="text-lg font-bold text-gray-900">Skills</h2>
            <div className="mt-4 space-y-5">
              {skills.map((s) => (
                <div key={s.group}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">{s.group}</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {s.items.map((item) => (
                      <li key={item} className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="about-contact" className="rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h2 id="about-contact" className="text-lg font-bold text-gray-900">Get in touch</h2>
            <p className="mt-2 text-sm text-gray-600">
              Open to interesting projects and full-time software roles.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {links.email && (
                <li><a href={`mailto:${links.email}`} className="inline-flex items-center gap-2 text-gray-800 hover:underline"><MailIcon /> {links.email}</a></li>
              )}
              {links.github && (
                <li><a href={links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-800 hover:underline"><GitHubIcon /> {links.github.replace(/^https?:\/\//, "")}</a></li>
              )}
              {links.linkedin && (
                <li><a href={links.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-gray-800 hover:underline"><LinkedInIcon /> {links.linkedin.replace(/^https?:\/\//, "")}</a></li>
              )}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};
export default About;
