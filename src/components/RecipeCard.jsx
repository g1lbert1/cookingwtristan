import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import DeleteRecipeButton from "./DeleteRecipeButton";
import { FavoriteButton, LikeButton } from "./ReactionButtons";
import { imageSrc } from "../cloudinary";
import AuthorLink from "./AuthorLink";

const formatPrepTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
};

//One recipe in a grid, shared by the recipes page and the profile tabs: a
//white card on the black page. The card body is the link; the byline, like,
//favorite, edit and delete controls sit outside it so links and buttons are
//never nested inside the anchor. Edit and delete show only to the poster
//and to admins.
export const RecipeCard = ({ recipe }) => {
  const { canManage } = useMe();
  return (
    <li className="card flex h-full flex-col overflow-hidden transition-[border-color,box-shadow] hover:border-plum/40 hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]">
      <Link to={`/recipes/${recipe.slug}`} className="group flex flex-col">
        {recipe.imageUrl && (
          <img
            src={imageSrc(recipe.imageUrl, { width: 800 })}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        )}
        <h3 className="font-display px-5 pt-5 text-2xl leading-tight text-black decoration-plum/50 underline-offset-4 group-hover:underline">
          {recipe.title}
        </h3>
      </Link>
      <div className="flex flex-1 flex-col px-5 pb-3">
        <p className="mt-1 text-sm text-black/60">
          by <AuthorLink author={recipe.author} className="font-medium text-black/80 hover:text-black" />
        </p>
        <p className="mt-auto pt-3 text-sm text-black/70">
          {formatPrepTime(recipe.prepTime)} · {recipe.ingredients.length}{" "}
          {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}
          {recipe.commentCount > 0 && (
            <> · {recipe.commentCount} {recipe.commentCount === 1 ? "comment" : "comments"}</>
          )}
        </p>
      </div>
      <div className="mx-5 mb-5 flex flex-wrap items-center gap-2">
        <LikeButton recipe={recipe} />
        <FavoriteButton recipe={recipe} />
        {canManage(recipe) && (
          <span className="ml-auto flex items-center gap-4">
            <Link
              to={`/recipes/${recipe.slug}/edit`}
              className="text-sm font-medium text-black/70 hover:text-black hover:underline"
            >
              Edit
            </Link>
            <DeleteRecipeButton recipe={recipe} tone="light" />
          </span>
        )}
      </div>
    </li>
  );
};

export const RecipeGrid = ({ recipes }) => (
  <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {recipes.map((recipe) => (
      <RecipeCard key={recipe._id} recipe={recipe} />
    ))}
  </ul>
);
