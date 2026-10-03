import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_RECIPE_BY_SLUG } from "../graphql/queries";
import { getErrorMessage, isNotFound } from "../graphql/errors";
import { useMe } from "../hooks/useMe";
import { imageSrc } from "../cloudinary";
import Seo from "../components/Seo";
import { SITE_AUTHOR } from "../content/site";

//Blog-style recipe page. Full-bleed navy background (#001357) with white
//text; the rest of the site keeps its light layout. The photo is the
//recipe's imageUrl, uploaded from the recipe form.

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

const Shell = ({ children }) => (
  <div className="flex-1 bg-[#001357] text-white">
    <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">{children}</div>
  </div>
);

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
  const image = imageSrc(recipe.imageUrl);

  return (
    <Shell>
      <Seo
        title={recipe.title}
        description={recipe.content || `${recipe.title}: ingredients and step-by-step instructions.`}
        image={imageSrc(recipe.imageUrl, { width: 1200 })}
      />
      <article>
        {/* HEADER */}
        <header className="max-w-3xl">
          <nav className="mb-6 flex items-center justify-between text-sm">
            <Link to="/recipes" className="text-white/70 hover:text-white">← All recipes</Link>
            {canManage(recipe) && (
              <Link
                to={`/recipes/${recipe.slug}/edit`}
                className="rounded-md border border-white/30 px-3 py-1 font-medium hover:bg-white/10"
              >
                Edit
              </Link>
            )}
          </nav>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {recipe.title}
          </h1>

          <p className="mt-3 text-white/70">
            by <span className="font-medium text-white">{recipe.author?.username ?? SITE_AUTHOR}</span>
            {recipe.likeCount > 0 && (
              <span> · {recipe.likeCount} {recipe.likeCount === 1 ? "like" : "likes"}</span>
            )}
          </p>

          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <ClockIcon /> {formatPrepTime(recipe.prepTime)}
            </li>
            <li>{recipe.ingredients.length} {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}</li>
            <li>{recipe.instructions.length} {recipe.instructions.length === 1 ? "step" : "steps"}</li>
          </ul>
        </header>

        {/* PHOTO */}
        <figure className="mt-10">
          {image ? (
            <img
              src={image}
              alt={`${recipe.title}, plated`}
              className="max-h-[560px] w-full rounded-xl object-cover object-center"
            />
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-dashed border-white/25 bg-white/5 text-sm text-white/50">
              Photo of the finished dish goes here
            </div>
          )}
        </figure>

        {/* INTRO */}
        {recipe.content && (
          <p className="mt-10 max-w-3xl text-lg leading-relaxed text-white/90">
            {recipe.content}
          </p>
        )}

        {/* BODY */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_2fr]">
          {/* Not sticky on purpose: with long ingredient notes the panel is
              taller than the viewport and a pinned panel's bottom would be
              unreachable until the instructions ran out. */}
          <aside>
            <h2 className="text-xl font-semibold">Ingredients</h2>
            <ul className="mt-4 divide-y divide-white/10 rounded-xl border border-white/10 bg-white/5">
              {recipe.ingredients.map((ing, i) => {
                const quantity = formatQuantity(ing);
                return (
                  <li key={i} className="flex items-baseline gap-3 px-4 py-3">
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

          <section>
            <h2 className="text-xl font-semibold">Instructions</h2>
            <ol className="mt-4 space-y-6">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-[#001357]">
                    {i + 1}
                  </span>
                  <p className="pt-1 leading-relaxed text-white/90">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </article>
    </Shell>
  );
};
export default Recipe;
