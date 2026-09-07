import RecipeList from "../components/RecipeList";

const Landing = () => (
  <>
    <section className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Cooking with Tristan
      </h1>
      <p className="mt-2 text-gray-600">
        Recipes I actually cook. Pick one and get started.
      </p>
    </section>

    <section aria-labelledby="recipes-heading">
      <h2 id="recipes-heading" className="mb-4 text-xl font-semibold text-gray-900">
        All recipes
      </h2>
      <RecipeList />
    </section>
  </>
);
export default Landing;
