import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useApolloClient } from "@apollo/client/react";
import { GET_RECIPES } from "../graphql/queries";
import GalleryBackground from "../components/GalleryBackground";
import Balatro from "../components/Balatro";
import Seo from "../components/Seo";
import { ArrowRightIcon } from "../components/Icons";

//Landing page: a scrolling photo wall on the black page behind one plum
//panel that holds the two doors into the site. The panel and the doors have
//no rule around them: plum on black and black on plum separate them. This
//route sits outside the shared centered container so the background runs
//full-bleed.
//
//Each door runs its own Balatro paint shader (see src/background.md): black
//paint with a violet swirl, no cursor interaction, no intro spin. A gradient
//scrim keeps the label legible over the brightest streaks. The shader only
//draws while the panel is on screen and the tab is visible.

const SWIRL = {
  color1: "#000000",
  color2: "#6a1fd6",
  color3: "#000000",
  swirl: 1,
  pixelSize: 1,
  lighting: 0.45,
  speed: 0.7,
  mouseInteraction: false,
  clickSwirl: false,
  intro: false,
  maxDevicePixelRatio: 1.5,
};

const Door = ({ to, title, blurb, cta }) => (
  <Link
    to={to}
    className="group relative isolate flex min-h-60 flex-col justify-end overflow-hidden rounded-2xl p-6 text-white transition-[filter] hover:brightness-110 sm:min-h-72 sm:p-8"
  >
    <div className="absolute inset-0 -z-20" aria-hidden="true">
      <Balatro {...SWIRL} />
    </div>
    <div
      className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/30 to-transparent"
      aria-hidden="true"
    />
    <h2 className="font-display text-5xl leading-none tracking-tight sm:text-6xl">{title}</h2>
    <p className="mt-3 max-w-xs text-white/80">{blurb}</p>
    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold">
      {cta}
      <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </span>
  </Link>
);

//Asks for the recipe list as soon as the home page is up. The API host spins
//down when idle and takes a while to wake; for a signed-in visitor the
//profile request absorbs that while they look at this page, but an
//anonymous visitor's first request used to be the recipes page itself.
//Fetching here means the server wakes (and the list lands in the Apollo
//cache) before they click through. Any failure is left for the recipes page
//to report properly; this is only a warm-up.
const useWarmRecipes = () => {
  const client = useApolloClient();
  useEffect(() => {
    client.query({ query: GET_RECIPES }).catch(() => {});
  }, [client]);
};

const Landing = () => {
  useWarmRecipes();
  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16">
      <Seo image="/og-image.jpg" />
      <GalleryBackground />

      <section
        className="panel relative z-10 w-full max-w-4xl border-0 p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-10"
        aria-labelledby="landing-heading"
      >
        <h1
          id="landing-heading"
          className="font-display text-center text-5xl leading-none tracking-tight text-balance text-white sm:text-6xl md:text-7xl"
        >
          Cooking with Tristan
        </h1>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5">
          <Door
            to="/recipes"
            title="Recipes"
            blurb="Check out my cool and awesome recipes."
            cta="Browse recipes"
          />
          <Door
            to="/about"
            title="About me"
            blurb="Learn more about me."
            cta="Read more"
          />
        </div>
      </section>
    </div>
  );
};
export default Landing;
