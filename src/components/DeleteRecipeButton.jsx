import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { DELETE_RECIPE } from "../graphql/mutations";
import { getErrorMessage } from "../graphql/errors";

//Two-step delete rendered inline, so no window.confirm() dialog. On success
//the recipe is evicted from the Apollo cache, which drops it from any list
//already on screen without a refetch.
export default function DeleteRecipeButton({ recipe, onDeleted }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  const [deleteRecipe, { loading }] = useMutation(DELETE_RECIPE, {
    update(cache) {
      cache.evict({ id: cache.identify({ __typename: "Recipe", _id: recipe._id }) });
      cache.gc();
    },
  });

  const confirm = async () => {
    setError(null);
    try {
      await deleteRecipe({ variables: { _id: recipe._id } });
      onDeleted?.();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm font-medium text-red-600 hover:underline"
      >
        Delete
      </button>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-gray-700">Delete "{recipe.title}"?</span>
      <button
        type="button"
        onClick={confirm}
        disabled={loading}
        className="rounded-md bg-red-600 px-2.5 py-1 font-medium text-white hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={loading}
        className="rounded-md border border-gray-300 px-2.5 py-1 font-medium text-gray-700 hover:bg-gray-100"
      >
        Cancel
      </button>
      {error && <span role="alert" className="text-red-600">{error}</span>}
    </span>
  );
}
