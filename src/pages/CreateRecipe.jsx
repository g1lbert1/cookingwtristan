import { useMutation } from "@apollo/client/react";
import { CREATE_RECIPE } from "../graphql/mutations";
import { useMe } from "../hooks/useMe";
import RecipeForm from "../components/RecipeForm";
import Seo from "../components/Seo";

//Open to every signed-in user. The server stamps the recipe with the poster
//and only they (or an admin) can edit it afterwards.
export default function CreateRecipe() {
  const { me } = useMe();

  //Apollo's refetchQueries only re-runs queries that are mounted, and while
  //this form is on screen neither the recipes page nor the profile is. So
  //both cached lists are patched by hand instead; a list that was never
  //fetched is absent from the cache, the patch is a no-op, and the first
  //visit fetches it fresh.
  const [createRecipe] = useMutation(CREATE_RECIPE, {
    update(cache, { data }) {
      const created = data?.createRecipe;
      if (!created) return;
      const notAlreadyThere = (existing, readField) =>
        !existing.some((ref) => readField("_id", ref) === created._id);

      //The public list: most liked first, then newest. A brand-new recipe has
      //no likes and the latest createdAt, so it belongs just ahead of the
      //first recipe that also has zero likes, or at the end if none has.
      cache.modify({
        fields: {
          recipes: (existing = [], { toReference, readField }) => {
            if (!notAlreadyThere(existing, readField)) return existing;
            const ref = toReference(created, true);
            const at = existing.findIndex((r) => (readField("likeCount", r) ?? 0) === 0);
            return at === -1
              ? [...existing, ref]
              : [...existing.slice(0, at), ref, ...existing.slice(at)];
          },
        },
      });

      //The profile's "My recipes" tab: newest first, so straight to the front.
      if (!me) return;
      cache.modify({
        id: cache.identify({ __typename: "User", _id: me._id }),
        fields: {
          recipes: (existing = [], { toReference, readField }) =>
            notAlreadyThere(existing, readField)
              ? [toReference(created, true), ...existing]
              : existing,
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
