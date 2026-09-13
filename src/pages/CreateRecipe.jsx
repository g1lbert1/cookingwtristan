import { useMutation } from "@apollo/client/react";
import { CREATE_RECIPE } from "../graphql/mutations";
import { GET_RECIPES } from "../graphql/queries";
import RecipeForm from "../components/RecipeForm";
import Seo from "../components/Seo";

export default function CreateRecipe() {
  //Refetch the list so the new recipe shows on the landing page immediately.
  const [createRecipe] = useMutation(CREATE_RECIPE, {
    refetchQueries: [GET_RECIPES],
  });

  const handleSubmit = async (input) => {
    const { data } = await createRecipe({ variables: { input } });
    const created = data.createRecipe;
    return `Created "${created.title}" at /recipes/${created.slug}`;
  };

  return (
    <>
      <Seo title="New recipe" noindex />
      <h1 className="mb-6 text-2xl font-bold text-gray-900">New recipe</h1>
      <RecipeForm
        onSubmit={handleSubmit}
        submitLabel="Create recipe"
        submittingLabel="Creating..."
        resetAfterSubmit
      />
    </>
  );
}
