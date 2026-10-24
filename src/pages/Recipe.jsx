import { Suspense, lazy } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_RECIPE_BY_SLUG } from "../graphql/queries";
import { getErrorMessage, isNotFound } from "../graphql/errors";
import { useMe } from "../hooks/useMe";
import { imageSrc } from "../cloudinary";
import Seo from "../components/Seo";
import { FavoriteButton, LikeButton } from "../components/ReactionButtons";
import Comments from "../components/Comments";
import AuthorLink from "../components/AuthorLink";
import { ArrowLeftIcon } from "../components/Icons";
import { accentColor } from "../recipeOptions";

//Recipe page on the black page: white text, the ingredients in a panel.
//The recipe's accent (a curated dark tone, plum by default) is set once as
//--accent on the page and colours the ingredients panel and step numbers.
//The layout decides the order of the same pieces:
//  CLASSIC   header, photo, story, ingredients beside the steps
//  EDITORIAL photo with the title over it, then one wide reading column
//  GALLERY   every photo first in a mosaic, then the recipe
//Recipes without a story, extra photos, layout or accent render exactly as
//they did before those existed.
//
//The Markdown renderer is the one heavy dependency here, so it loads only
//for recipes that have a story; the plain text shows until it arrives.

const Markdown = lazy(() => import("../components/Markdown"));

const UNIT_LABELS = {
  GRAMS: "g",
  CUPS: "cup",
  TABLESPOONS: "tbsp",
  TEASPOONS: "tsp",
  PIECE: "",
  ML: "ml",
  LITER: "L",
  OUNCE: "oz",
  POUND: "lb",
};

const FRACTIONS = [
  [0.25, "¼"], [0.333, "⅓"], [0.5, "½"], [0.667, "⅔"], [0.75, "¾"],
];

//"0.5" -> "½", "1.5" -> "1½", "200" -> "200", "2.3" -> "2.3"
const formatAmount = (amount) => {
  if (amount == null) return "";
  const whole = Math.floor(amount);
  const rest = amount - whole;
  const fraction = FRACTIONS.find(([v]) => Math.abs(rest - v) < 0.02);
  if (fraction) return `${whole || ""}${fraction[1]}`;
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2).replace(/\.?0+$/, "");
};

const formatQuantity = (ing) => {
  const amount = formatAmount(ing.amount);
  const unit = ing.unit ? UNIT_LABELS[ing.unit] ?? ing.unit.toLowerCase() : "";
  const plural = ing.unit === "CUPS" && ing.amount > 1 ? "s" : "";
  return [amount, unit && `${unit}${plural}`].filter(Boolean).join(" ");
};

const formatPrepTime = (minutes) => {
  if (minutes < 60) return `${minutes} minutes`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hours = `${h} ${h === 1 ? "hour" : "hours"}`;
  return m ? `${hours} ${m} minutes` : hours;
};

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const Shell = ({ children, style }) => (
  <div className="flex-1 text-white" style={style}>
    <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">{children}</div>
  </div>
);

/* ---------- the pieces every layout is built from ---------- */

const TopNav = ({ recipe, canEdit }) => (
  <nav className="mb-6 flex items-center justify-between text-sm">
    <Link to="/recipes" className="inline-flex items-center gap-1.5 text-white/70 transition-colors hover:text-white">
      <ArrowLeftIcon />
      All recipes
    </Link>
    {canEdit && (
      <Link to={`/recipes/${recipe.slug}/edit`} className="btn btn-secondary btn-sm">
        Edit
      </Link>
    )}
  </nav>
);

const Title = ({ recipe, className = "" }) => (
  <h1 className={`font-display leading-none tracking-tight text-balance ${className}`}>{recipe.title}</h1>
);

const Byline = ({ recipe, className = "mt-4 text-white/70" }) => (
  <p className={className}>
    by <AuthorLink author={recipe.author} className="font-medium text-white" />
  </p>
);

const Reactions = ({ recipe, className = "mt-5" }) => (
  <div className={`flex flex-wrap items-center gap-3 ${className}`}>
    <LikeButton recipe={recipe} tone="dark" />
    <FavoriteButton recipe={recipe} tone="dark" />
  </div>
);

const Meta = ({ recipe, className = "mt-5" }) => (
  <ul className={`flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80 ${className}`}>
    <li className="flex items-center gap-2">
      <ClockIcon /> {formatPrepTime(recipe.prepTime)}
    </li>
    <li>{recipe.ingredients.length} {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}</li>
    <li>{recipe.instructions.length} {recipe.instructions.length === 1 ? "step" : "steps"}</li>
    <li>
      <a href="#comments" className="hover:text-white">
        {recipe.commentCount} {recipe.commentCount === 1 ? "comment" : "comments"}
      </a>
    </li>
  </ul>
);

const Placeholder = ({ className = "aspect-[16/9]" }) => (
  <div className={`flex w-full items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/5 text-sm text-white/50 ${className}`}>
    Photo of the finished dish goes here
  </div>
);

const Intro = ({ recipe, className = "mt-10 max-w-3xl text-lg" }) =>
  recipe.content ? <p className={`leading-relaxed text-white/90 ${className}`}>{recipe.content}</p> : null;

const Story = ({ recipe, className = "mt-10 max-w-3xl" }) =>
  recipe.story ? (
    <section className={className} aria-label="Story">
      <Suspense fallback={<p className="whitespace-pre-wrap leading-relaxed text-white/90">{recipe.story}</p>}>
        <Markdown>{recipe.story}</Markdown>
      </Suspense>
    </section>
  ) : null;

//The extra photos, numbered after the cover in the alt text.
const GalleryGrid = ({ recipe, className = "mt-3 sm:grid-cols-4" }) =>
  recipe.gallery.length > 0 ? (
    <ul className={`grid grid-cols-2 gap-3 ${className}`}>
      {recipe.gallery.map((url, i) => (
        <li key={url}>
          <img
            src={imageSrc(url, { width: 800 })}
            alt={`${recipe.title}, photo ${i + 2}`}
            loading="lazy"
            className="aspect-square w-full rounded-xl object-cover"
          />
        </li>
      ))}
    </ul>
  ) : null;

const Ingredients = ({ recipe, columns = false, className = "" }) => (
  <aside className={className}>
    <h2 className="font-display text-3xl">Ingredients</h2>
    <ul className={`panel mt-4 overflow-hidden bg-(--accent) ${columns ? "sm:grid sm:grid-cols-2" : ""}`}>
      {recipe.ingredients.map((ing, i) => {
        const quantity = formatQuantity(ing);
        return (
          <li key={i} className="flex items-baseline gap-3 border-b border-white/15 px-4 py-3 last:border-b-0">
            {quantity && (
              <span className="w-20 shrink-0 text-sm font-semibold tabular-nums text-white/90">
                {quantity}
              </span>
            )}
            <span>
              {ing.name}
              {ing.notes && <span className="text-white/60">, {ing.notes}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  </aside>
);

const Steps = ({ recipe, className = "" }) => (
  <section className={className}>
    <h2 className="font-display text-3xl">Instructions</h2>
    <ol className="mt-4 space-y-6">
      {recipe.instructions.map((step, i) => (
        <li key={i} className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-(--accent)">
            {i + 1}
          </span>
          <p className="pt-1 leading-relaxed text-white/90">{step}</p>
        </li>
      ))}
    </ol>
  </section>
);

/* ---------- layouts ---------- */

//Not sticky on purpose: with long ingredient notes the panel is taller than
//the viewport and a pinned panel's bottom would be unreachable until the
//instructions ran out.
const SideBySide = ({ recipe }) => (
  <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_2fr]">
    <Ingredients recipe={recipe} />
    <Steps recipe={recipe} />
  </div>
);

const ClassicLayout = ({ recipe, canEdit }) => {
  const image = imageSrc(recipe.imageUrl);
  return (
    <>
      <header className="max-w-3xl">
        <TopNav recipe={recipe} canEdit={canEdit} />
        <Title recipe={recipe} className="text-5xl sm:text-6xl md:text-7xl" />
        <Byline recipe={recipe} />
        <Reactions recipe={recipe} />
        <Meta recipe={recipe} />
      </header>

      <figure className="mt-10">
        {image ? (
          <img src={image} alt={`${recipe.title}, plated`} className="max-h-[560px] w-full rounded-xl object-cover object-center" />
        ) : (
          <Placeholder />
        )}
      </figure>
      <GalleryGrid recipe={recipe} />

      <Intro recipe={recipe} />
      <Story recipe={recipe} />
      <SideBySide recipe={recipe} />
    </>
  );
};

const EditorialLayout = ({ recipe, canEdit }) => {
  const image = imageSrc(recipe.imageUrl, { width: 2000 });
  return (
    <>
      <TopNav recipe={recipe} canEdit={canEdit} />
      <header className="relative isolate overflow-hidden rounded-2xl bg-(--accent)">
        {image && (
          <>
            <img src={image} alt={`${recipe.title}, plated`} className="aspect-[4/3] w-full object-cover sm:aspect-[21/9]" />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/45 to-black/10" aria-hidden="true" />
          </>
        )}
        <div className={image ? "absolute inset-x-0 bottom-0 p-6 sm:p-10" : "p-6 sm:p-10"}>
          <Title recipe={recipe} className="text-5xl sm:text-6xl md:text-7xl" />
          <Byline recipe={recipe} className="mt-3 text-white/80" />
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <Reactions recipe={recipe} className="mt-0" />
        <Meta recipe={recipe} className="mt-0" />
      </div>

      <div className="mx-auto mt-12 max-w-3xl">
        <Intro recipe={recipe} className="mt-0 text-xl" />
        <Story recipe={recipe} className={recipe.content ? "mt-8" : "mt-0"} />
        <GalleryGrid recipe={recipe} className="mt-10 sm:grid-cols-2" />
        <Ingredients recipe={recipe} columns className="mt-12" />
        <Steps recipe={recipe} className="mt-12" />
      </div>
    </>
  );
};

//Cover first and largest, the rest filling in around it. One photo alone is
//shown the classic way rather than as a lopsided mosaic.
const Mosaic = ({ recipe }) => {
  const photos = [recipe.imageUrl, ...recipe.gallery].filter(Boolean);
  if (photos.length === 0) return <Placeholder />;
  if (photos.length === 1) {
    return <img src={imageSrc(photos[0])} alt={`${recipe.title}, plated`} className="max-h-[560px] w-full rounded-xl object-cover object-center" />;
  }
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((url, i) => (
        <li key={url} className={i === 0 ? "col-span-2 row-span-2" : ""}>
          <img
            src={imageSrc(url, { width: i === 0 ? 1600 : 800 })}
            alt={i === 0 ? `${recipe.title}, plated` : `${recipe.title}, photo ${i + 1}`}
            loading={i === 0 ? "eager" : "lazy"}
            className="aspect-square h-full w-full rounded-xl object-cover"
          />
        </li>
      ))}
    </ul>
  );
};

const GalleryLayout = ({ recipe, canEdit }) => (
  <>
    <TopNav recipe={recipe} canEdit={canEdit} />
    <Mosaic recipe={recipe} />
    <header className="mt-10 max-w-3xl">
      <Title recipe={recipe} className="text-5xl sm:text-6xl md:text-7xl" />
      <Byline recipe={recipe} />
      <Reactions recipe={recipe} />
      <Meta recipe={recipe} />
    </header>
    <Intro recipe={recipe} />
    <Story recipe={recipe} />
    <SideBySide recipe={recipe} />
  </>
);

const LAYOUTS = {
  CLASSIC: ClassicLayout,
  EDITORIAL: EditorialLayout,
  GALLERY: GalleryLayout,
};

const Recipe = () => {
  const { slug } = useParams();
  const { data, loading, error } = useQuery(GET_RECIPE_BY_SLUG, { variables: { slug } });
  const { canManage } = useMe();

  if (loading) {
    return (
      <Shell>
        <p className="text-white/70">Loading recipe...</p>
      </Shell>
    );
  }

  if (error) {
    return (
      <Shell>
        <h1 className="text-3xl font-bold">
          {isNotFound(error) ? "Recipe not found" : "Couldn't load this recipe"}
        </h1>
        <p className="mt-3 text-white/70">{getErrorMessage(error)}</p>
        <Link to="/recipes" className="mt-6 inline-block font-medium underline underline-offset-4">
          Back to all recipes
        </Link>
      </Shell>
    );
  }

  const recipe = data.getRecipeBySlug;
  const Layout = LAYOUTS[recipe.layout] ?? ClassicLayout;

  return (
    <Shell style={{ "--accent": accentColor(recipe.accent) }}>
      <Seo
        title={recipe.title}
        description={recipe.content || `${recipe.title}: ingredients and step-by-step instructions.`}
        image={imageSrc(recipe.imageUrl, { width: 1200 })}
      />
      <article>
        <Layout recipe={recipe} canEdit={canManage(recipe)} />
        <Comments recipe={recipe} />
      </article>
    </Shell>
  );
};
export default Recipe;
