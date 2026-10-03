import { useQuery } from "@apollo/client/react";
import { GET_RECIPES } from "../graphql/queries";
import { RecipeGrid } from "./RecipeCard";

//Every recipe, as the server orders them: most liked first, then newest.
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
    return <p className="text-gray-600">No recipes yet. Be the first to share one.</p>;
  }

  return <RecipeGrid recipes={recipes} />;
};
export default RecipeList;
