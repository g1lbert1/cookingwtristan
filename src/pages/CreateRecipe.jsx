import { useMutation } from "@apollo/client/react";
import { CREATE_RECIPE } from "../graphql/mutations";
import { GET_RECIPES } from "../graphql/queries";
import RecipeForm from "../components/RecipeForm";
import Seo from "../components/Seo";

//Open to every signed-in user. The server stamps the recipe with the poster
//and only they (or an admin) can edit it afterwards.
export default function CreateRecipe() {
  //Refetch the list so the new recipe shows on the recipes page immediately.
  const [createRecipe] = useMutation(CREATE_RECIPE, {
    refetchQueries: [GET_RECIPES],
  });

  const handleSubmit = async (input) => {
    const { data } = await createRecipe({ variables: { input } });
    const created = data.createRecipe;
    return `Shared "${created.title}" at /recipes/${created.slug}`;
  };

  return (
    <>
      <Seo title="Share a recipe" noindex />
      <h1 className="text-2xl font-bold text-gray-900">Share a recipe</h1>
      <p className="mb-6 mt-2 text-gray-600">
        It goes straight onto the recipes page under your name.
      </p>
      <RecipeForm
        onSubmit={handleSubmit}
        submitLabel="Share recipe"
        submittingLabel="Sharing..."
        resetAfterSubmit
      />
    </>
  );
}
