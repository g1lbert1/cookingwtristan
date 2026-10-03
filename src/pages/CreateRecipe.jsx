import { useMutation } from "@apollo/client/react";
import { CREATE_RECIPE } from "../graphql/mutations";
import { GET_RECIPES } from "../graphql/queries";
import { useMe } from "../hooks/useMe";
import RecipeForm from "../components/RecipeForm";
import Seo from "../components/Seo";

//Open to every signed-in user. The server stamps the recipe with the poster
//and only they (or an admin) can edit it afterwards.
export default function CreateRecipe() {
  const { me } = useMe();

  const [createRecipe] = useMutation(CREATE_RECIPE, {
    //The public list is ordered by likes, so let the server re-sort it.
    refetchQueries: [GET_RECIPES],
    //The profile's "My recipes" tab is a list on the cached User that no
    //refetch above touches. Put the new recipe at its front (the tab shows
    //newest first). If the tab was never opened the field is not cached and
    //this is a no-op; the first visit fetches it fresh.
    update(cache, { data }) {
      const created = data?.createRecipe;
      if (!created || !me) return;
      cache.modify({
        id: cache.identify({ __typename: "User", _id: me._id }),
        fields: {
          recipes: (existing = [], { toReference }) => [toReference(created, true), ...existing],
        },
      });
    },
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
