import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import RecipeList from "../components/RecipeList";
import Seo from "../components/Seo";

const buttonClass =
  "rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800";

//The full recipe list: the site's own recipes and everyone else's, most
//liked first. The landing page links here from its "Recipes" card.
const Recipes = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  //Anonymous visitors go through login and land on the form afterwards.
  const loginToShare = () =>
    loginWithRedirect({ appState: { returnTo: "/recipes/new" } });

  return (
    <>
      <Seo
        title="Recipes"
        description="Recipes from Tristan and the community on Cooking with Tristan, with photos and step-by-step instructions."
      />
      <section className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Recipes
        </h1>
        <p className="mt-2 text-gray-600">
          Mine and yours, most loved first. Enjoy!
        </p>
      </section>

      <section aria-labelledby="recipes-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recipes-heading" className="text-xl font-semibold text-gray-900">
            All recipes
          </h2>
          {isAuthenticated ? (
            <Link to="/recipes/new" className={buttonClass}>
              + Share a recipe
            </Link>
          ) : (
            <button
              type="button"
              onClick={loginToShare}
              disabled={isLoading}
              className={`${buttonClass} disabled:opacity-50`}
            >
              Log in to share a recipe
            </button>
          )}
        </div>
        <RecipeList />
      </section>
    </>
  );
};
export default Recipes;
