import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_RECIPES } from "../graphql/queries";
import { useMe } from "../hooks/useMe";
import DeleteRecipeButton from "./DeleteRecipeButton";
import { imageSrc } from "../cloudinary";
import { SITE_AUTHOR } from "../content/site";

const formatPrepTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
};

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.6-9.2C1 8.6 3 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 19 5 21 8.6 19.6 11.8 17.5 16.4 12 21 12 21z" />
  </svg>
);

//The card body is the link; edit and delete controls sit outside it so
//buttons are not nested inside an anchor. They show only to the poster and
//to admins. The like count is read-only here; liking arrives with the next
//increment.
const RecipeCard = ({ recipe, canManage }) => (
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
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:underline">{recipe.title}</h3>
        <p className="mt-1 text-sm text-gray-500">by {recipe.author?.username ?? SITE_AUTHOR}</p>
        <p className="mt-auto flex items-center justify-between pt-3 text-sm text-gray-600">
          <span>
            {formatPrepTime(recipe.prepTime)} · {recipe.ingredients.length}{" "}
            {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}
          </span>
          <span
            className="flex items-center gap-1 text-gray-500"
            aria-label={`${recipe.likeCount} ${recipe.likeCount === 1 ? "like" : "likes"}`}
          >
            <HeartIcon /> {recipe.likeCount}
          </span>
        </p>
      </div>
    </Link>
    {canManage && (
      <div className="mx-5 mb-5 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-3">
        <Link
          to={`/recipes/${recipe.slug}/edit`}
          className="text-sm font-medium text-gray-700 hover:underline"
        >
          Edit
        </Link>
        <DeleteRecipeButton recipe={recipe} />
      </div>
    )}
  </li>
);

const RecipeList = () => {
  const { data, loading, error, refetch } = useQuery(GET_RECIPES);
  const { canManage } = useMe();

  if (loading) return <p className="text-gray-600">Loading recipes...</p>;

  if (error) {
    return (
      <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="font-medium text-red-700">Couldn't load recipes.</p>
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  //Already sorted by the server: most liked first, then newest.
  const recipes = data?.recipes ?? [];
  if (recipes.length === 0) {
    return <p className="text-gray-600">No recipes yet. Be the first to share one.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} canManage={canManage(recipe)} />
      ))}
    </ul>
  );
};
export default RecipeList;
