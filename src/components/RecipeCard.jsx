import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import DeleteRecipeButton from "./DeleteRecipeButton";
import { FavoriteButton, LikeButton } from "./ReactionButtons";
import { imageSrc } from "../cloudinary";
import { SITE_AUTHOR } from "../content/site";

const formatPrepTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
};

//One recipe in a grid, shared by the recipes page and the profile tabs. The
//card body is the link; the like, favorite, edit and delete controls sit
//below it so buttons are never nested inside the anchor. Edit and delete
//show only to the poster and to admins.
export const RecipeCard = ({ recipe }) => {
  const { canManage } = useMe();
  return (
    <li className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link to={`/recipes/${recipe.slug}`} className="group flex flex-1 flex-col">
        {recipe.imageUrl && (
          <img
            src={imageSrc(recipe.imageUrl, { width: 800 })}
            alt=""
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
        )}
        <div className="flex flex-1 flex-col p-5 pb-3">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:underline">{recipe.title}</h3>
          <p className="mt-1 text-sm text-gray-500">by {recipe.author?.username ?? SITE_AUTHOR}</p>
          <p className="mt-auto pt-3 text-sm text-gray-600">
            {formatPrepTime(recipe.prepTime)} · {recipe.ingredients.length}{" "}
            {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}
            {recipe.commentCount > 0 && (
              <> · {recipe.commentCount} {recipe.commentCount === 1 ? "comment" : "comments"}</>
            )}
          </p>
        </div>
      </Link>
      <div className="mx-5 mb-5 flex flex-wrap items-center gap-2">
        <LikeButton recipe={recipe} />
        <FavoriteButton recipe={recipe} />
        {canManage(recipe) && (
          <span className="ml-auto flex items-center gap-4">
            <Link
              to={`/recipes/${recipe.slug}/edit`}
              className="text-sm font-medium text-gray-700 hover:underline"
            >
              Edit
            </Link>
            <DeleteRecipeButton recipe={recipe} />
          </span>
        )}
      </div>
    </li>
  );
};

export const RecipeGrid = ({ recipes }) => (
  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {recipes.map((recipe) => (
      <RecipeCard key={recipe._id} recipe={recipe} />
    ))}
  </ul>
);
