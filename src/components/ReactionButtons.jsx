import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import {
  LIKE_RECIPE,
  UNLIKE_RECIPE,
  FAVORITE_RECIPE,
  UNFAVORITE_RECIPE,
} from "../graphql/mutations";
import { useMe } from "../hooks/useMe";
import { getErrorMessage } from "../graphql/errors";

//Like and favorite toggles, used on the cards and the recipe page.
//
//Anonymous click: go through login and come back to this page.
//Signed-in click: run the mutation with an optimistic result so the button
//flips instantly; the server's answer then replaces it. Apollo keys Recipe
//by _id, so every copy of the recipe on screen updates together. The
//profile tabs are lists on the User object that Apollo cannot derive from a
//single recipe, so the relevant list is evicted and refetches when viewed.

const useReaction = ({ recipe, active, onDoc, offDoc, resultField, listField, optimistic }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { me } = useMe();
  const location = useLocation();
  const [error, setError] = useState(null);

  const [mutate, { loading }] = useMutation(active ? offDoc : onDoc, {
    variables: { _id: recipe._id },
    optimisticResponse: {
      [resultField[active ? 1 : 0]]: {
        __typename: "Recipe",
        _id: recipe._id,
        likeCount: recipe.likeCount,
        likedByMe: recipe.likedByMe,
        favoritedByMe: recipe.favoritedByMe,
        ...optimistic(!active),
      },
    },
    update(cache) {
      if (!me) return;
      cache.evict({ id: cache.identify({ __typename: "User", _id: me._id }), fieldName: listField });
      cache.gc();
    },
  });

  const toggle = async () => {
    if (!isAuthenticated) {
      loginWithRedirect({ appState: { returnTo: location.pathname } });
      return;
    }
    setError(null);
    try {
      await mutate();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return { toggle, loading, error };
};

//Light tone sits on white cards; dark tone on the navy recipe page.
const toneClass = {
  light: {
    base: "border-gray-300 text-gray-700 hover:bg-gray-100",
    active: "border-gray-900 bg-gray-900 text-white hover:bg-gray-800",
  },
  dark: {
    base: "border-white/30 text-white hover:bg-white/10",
    active: "border-white bg-white text-[#001357] hover:bg-white/90",
  },
};

const ReactionButton = ({ active, loading, error, onClick, tone, icon, label, count }) => (
  <span className="inline-flex flex-col items-start">
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-pressed={active}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-medium transition disabled:opacity-60 ${
        active ? toneClass[tone].active : toneClass[tone].base
      }`}
    >
      {icon}
      <span>{label}</span>
      {count != null && <span className="tabular-nums">{count}</span>}
    </button>
    {error && <span role="alert" className="mt-1 text-xs text-red-600">{error}</span>}
  </span>
);

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="2" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <path d="M12 21s-7.5-4.6-9.6-9.2C1 8.6 3 5 6.6 5c2 0 3.4 1.1 4.4 2.5C12 6.1 13.4 5 15.4 5 19 5 21 8.6 19.6 11.8 17.5 16.4 12 21 12 21z" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="2" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
    <path d="M12 3l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.4l-5.7 3.1 1.2-6.4L2.8 9.7l6.4-.8z" />
  </svg>
);

export const LikeButton = ({ recipe, tone = "light" }) => {
  const { toggle, loading, error } = useReaction({
    recipe,
    active: recipe.likedByMe,
    onDoc: LIKE_RECIPE,
    offDoc: UNLIKE_RECIPE,
    resultField: ["likeRecipe", "unlikeRecipe"],
    listField: "likedRecipes",
    optimistic: (liked) => ({
      likedByMe: liked,
      likeCount: Math.max(0, recipe.likeCount + (liked ? 1 : -1)),
    }),
  });
  return (
    <ReactionButton
      active={recipe.likedByMe}
      loading={loading}
      error={error}
      onClick={toggle}
      tone={tone}
      icon={<HeartIcon filled={recipe.likedByMe} />}
      label={recipe.likedByMe ? "Liked" : "Like"}
      count={recipe.likeCount}
    />
  );
};

export const FavoriteButton = ({ recipe, tone = "light" }) => {
  const { toggle, loading, error } = useReaction({
    recipe,
    active: recipe.favoritedByMe,
    onDoc: FAVORITE_RECIPE,
    offDoc: UNFAVORITE_RECIPE,
    resultField: ["favoriteRecipe", "unfavoriteRecipe"],
    listField: "favoriteRecipes",
    optimistic: (favorited) => ({ favoritedByMe: favorited }),
  });
  return (
    <ReactionButton
      active={recipe.favoritedByMe}
      loading={loading}
      error={error}
      onClick={toggle}
      tone={tone}
      icon={<StarIcon filled={recipe.favoritedByMe} />}
      label={recipe.favoritedByMe ? "Favorited" : "Favorite"}
    />
  );
};
