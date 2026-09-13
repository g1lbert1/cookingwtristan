import { Link } from "react-router-dom";
import RecipeList from "../components/RecipeList";
import { useMe } from "../hooks/useMe";

//The full recipe list. The landing page links here from its "Recipes" card.
const Recipes = () => {
  const { isAdmin } = useMe();

  return (
    <>
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Recipes
        </h1>
        <p className="mt-2 text-gray-600">
          Enjoy!
        </p>
      </section>

      <section aria-labelledby="recipes-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recipes-heading" className="text-xl font-semibold text-gray-900">
            All recipes
          </h2>
          {isAdmin && (
            <Link
              to="/admin/createRecipe"
              className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              + New recipe
            </Link>
          )}
        </div>
        <RecipeList />
      </section>
    </>
  );
};
export default Recipes;
