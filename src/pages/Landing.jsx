import { Link } from "react-router-dom";
import GalleryBackground from "../components/GalleryBackground";
import Balatro from "../components/Balatro";
import Seo from "../components/Seo";

//Landing page: scrolling photo wall behind three cards. This route sits
//outside the shared centered container so the background runs full-bleed.

//The panel runs the Balatro paint shader (black / electric blue / black);
//the cards inside are near-black with a subtle border so they read as
//separate blocks on top of it. The same shader fills the gaps in the gallery.
const cardClass =
  "flex flex-col justify-between rounded-2xl border border-white/10 bg-gray-950 p-6 text-white shadow-lg";

const Landing = () => (
  <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
    <Seo image="/og-image.jpg" />
    <GalleryBackground />

    <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl">
      <div className="absolute inset-0" aria-hidden="true">
        <Balatro
          color1="#000000"
          color2="#2700ea"
          color3="#000000"
          pixelFilter={1100}
          mouseInteraction={false}
        />
      </div>

      <div className="relative p-8 sm:p-12">
      <div className="mb-10 text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Cooking with Tristan
        </h1>
        <p className="mt-3 text-lg text-white/90">
          In the flesh
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Link
          to="/recipes"
          className={`${cardClass} transition hover:-translate-y-1 hover:bg-gray-900`}
        >
          <div>
            <h2 className="text-2xl font-semibold">Recipes</h2>
            <p className="mt-2 text-white/80">
              Check out my cool and awesome recipes.
            </p>
          </div>
          <span className="mt-6 text-sm font-medium">Browse recipes →</span>
        </Link>

        <Link
          to="/about"
          className={`${cardClass} transition hover:-translate-y-1 hover:bg-gray-900`}
        >
          <div>
            <h2 className="text-2xl font-semibold">About me</h2>
            <p className="mt-2 text-white/80">
              Learn more about me.
            </p>
          </div>
          <span className="mt-6 text-sm font-medium">Read more →</span>
        </Link>

        <div className={cardClass} aria-disabled="true">
          <div>
            <h2 className="text-2xl font-semibold">Coming soon</h2>
            <p className="mt-2 text-white/80">
              Something new is in the works.
            </p>
          </div>
          <span className="mt-6 inline-block w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide">
            Under construction
          </span>
        </div>
      </div>
      </div>
    </div>
  </div>
);
export default Landing;
