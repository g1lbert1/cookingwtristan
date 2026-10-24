import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import RecipeList from "../components/RecipeList";
import Seo from "../components/Seo";
import { PlusIcon } from "../components/Icons";

//The full recipe list: the site's own recipes and everyone else's, most
//liked first. The landing page links here from its "Recipes" door.
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
      <section className="mb-10">
        <h1 className="font-display text-5xl leading-none tracking-tight text-white sm:text-6xl">
          Recipes
        </h1>
        <p className="mt-3 text-white/70">
          Mine and yours, most loved first. Enjoy!
        </p>
      </section>

      <section aria-labelledby="recipes-heading">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 id="recipes-heading" className="text-xl font-semibold text-white">
            All recipes
          </h2>
          {isAuthenticated ? (
            <Link to="/recipes/new" className="btn btn-primary">
              <PlusIcon />
              Share a recipe
            </Link>
          ) : (
            <button
              type="button"
              onClick={loginToShare}
              disabled={isLoading}
              className="btn btn-primary"
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
