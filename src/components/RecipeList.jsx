import { useQuery } from "@apollo/client/react";
import { GET_RECIPES } from "../graphql/queries";
import { RecipeGrid } from "./RecipeCard";

//Every recipe, as the server orders them: most liked first, then newest.
const RecipeList = () => {
  const { data, loading, error, refetch } = useQuery(GET_RECIPES);

  if (loading) return <p className="text-white/60">Loading recipes...</p>;

  if (error) {
    return (
      <div role="alert" className="alert-error">
        <p className="font-medium">Couldn't load recipes.</p>
        <p className="mt-1 text-sm text-red-200/80">{error.message}</p>
        <button type="button" onClick={() => refetch()} className="btn btn-secondary btn-sm mt-3">
          Try again
        </button>
      </div>
    );
  }

  const recipes = data?.recipes ?? [];
  if (recipes.length === 0) {
    return <p className="text-white/70">No recipes yet. Be the first to share one.</p>;
  }

  return <RecipeGrid recipes={recipes} />;
};
export default RecipeList;
