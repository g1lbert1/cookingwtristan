import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_RECIPES } from "../graphql/queries";

const formatPrepTime = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
};

const RecipeCard = ({ recipe }) => (
  <li>
    <Link
      to={`/recipes/${recipe.slug}`}
      className="block h-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <h3 className="text-lg font-semibold text-gray-900">{recipe.title}</h3>
      <p className="mt-2 text-sm text-gray-600">
        {formatPrepTime(recipe.prepTime)} · {recipe.ingredients.length}{" "}
        {recipe.ingredients.length === 1 ? "ingredient" : "ingredients"}
      </p>
    </Link>
  </li>
);

const RecipeList = () => {
  const { data, loading, error, refetch } = useQuery(GET_RECIPES);

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

  const recipes = data?.recipes ?? [];
  if (recipes.length === 0) {
    return <p className="text-gray-600">No recipes yet. Check back soon.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe._id} recipe={recipe} />
      ))}
    </ul>
  );
};
export default RecipeList;
