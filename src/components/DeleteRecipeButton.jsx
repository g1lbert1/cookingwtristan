import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { DELETE_RECIPE } from "../graphql/mutations";
import { getErrorMessage } from "../graphql/errors";

//Two-step delete rendered inline, so no window.confirm() dialog. On success
//the recipe is evicted from the Apollo cache, which drops it from any list
//already on screen without a refetch.
//
//Light tone sits on the white recipe cards; dark tone on the black edit page.
const toneClass = {
  light: { trigger: "text-red-700", text: "text-black/80", cancel: "btn-ink", error: "text-red-700" },
  dark: { trigger: "text-red-300", text: "text-white/80", cancel: "btn-secondary", error: "text-red-300" },
};

export default function DeleteRecipeButton({ recipe, onDeleted, tone = "dark" }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const classes = toneClass[tone];

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
        className={`text-sm font-medium hover:underline ${classes.trigger}`}
      >
        Delete
      </button>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-2 text-sm">
      <span className={classes.text}>Delete "{recipe.title}"?</span>
      <button type="button" onClick={confirm} disabled={loading} className="btn btn-danger btn-sm">
        {loading ? "Deleting..." : "Yes, delete"}
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        disabled={loading}
        className={`btn btn-sm ${classes.cancel}`}
      >
        Cancel
      </button>
      {error && <span role="alert" className={classes.error}>{error}</span>}
    </span>
  );
}
