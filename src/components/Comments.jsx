import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_RECIPE_COMMENTS } from "../graphql/queries";
import { ADD_COMMENT, DELETE_COMMENT } from "../graphql/mutations";
import { getErrorMessage } from "../graphql/errors";

//The thread under a recipe, on the recipe page's navy background. The list
//is its own query so the recipe itself renders before the comments arrive.
//Both mutations patch the cached Recipe directly (its comments list and
//commentCount), so the count in the header and on the cards stays in step
//without a refetch.

const MAX_BODY = 1000;

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const UNITS = [
  ["year", 365 * 24 * 60 * 60],
  ["month", 30 * 24 * 60 * 60],
  ["week", 7 * 24 * 60 * 60],
  ["day", 24 * 60 * 60],
  ["hour", 60 * 60],
  ["minute", 60],
];
const timeAgo = (iso) => {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return RELATIVE.format(Math.round(seconds / size), unit);
  }
  return "just now";
};

const recipeCacheId = (cache, recipe) =>
  cache.identify({ __typename: "Recipe", _id: recipe._id });

const Avatar = ({ author }) =>
  author?.avatar ? (
    <img src={author.avatar} alt="" className="h-9 w-9 rounded-full object-cover" referrerPolicy="no-referrer" />
  ) : (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
      {author?.username?.[0]?.toUpperCase() ?? "?"}
    </div>
  );

//Two-step delete, inline, matching DeleteRecipeButton.
const DeleteCommentButton = ({ comment, recipe }) => {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);
  const [deleteComment, { loading }] = useMutation(DELETE_COMMENT, {
    variables: { _id: comment._id },
    update(cache) {
      cache.modify({
        id: recipeCacheId(cache, recipe),
        fields: {
          comments: (existing = [], { readField }) =>
            existing.filter((ref) => readField("_id", ref) !== comment._id),
          commentCount: (n = 0) => Math.max(0, n - 1),
        },
      });
      cache.evict({ id: cache.identify({ __typename: "Comment", _id: comment._id }) });
      cache.gc();
    },
  });

  const confirm = async () => {
    setError(null);
    try {
      await deleteComment();
    } catch (err) {
      setError(getErrorMessage(err));
      setConfirming(false);
    }
  };

  if (!confirming) {
    return (
      <span className="flex flex-col items-end">
        <button type="button" onClick={() => setConfirming(true)} className="text-xs text-white/60 hover:text-white hover:underline">
          Delete
        </button>
        {error && <span role="alert" className="mt-1 text-xs text-red-300">{error}</span>}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2 text-xs">
      <button
        type="button"
        onClick={confirm}
        disabled={loading}
        className="rounded bg-red-500 px-2 py-0.5 font-medium text-white hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Yes, delete"}
      </button>
      <button type="button" onClick={() => setConfirming(false)} disabled={loading} className="text-white/70 hover:text-white">
        Cancel
      </button>
    </span>
  );
};

const CommentForm = ({ recipe }) => {
  const [body, setBody] = useState("");
  const [error, setError] = useState(null);
  const [addComment, { loading }] = useMutation(ADD_COMMENT, {
    update(cache, { data }) {
      const created = data?.addComment;
      if (!created) return;
      cache.modify({
        id: recipeCacheId(cache, recipe),
        fields: {
          comments: (existing = [], { toReference }) => [...existing, toReference(created, true)],
          commentCount: (n = 0) => n + 1,
        },
      });
    },
  });

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await addComment({ variables: { recipeId: recipe._id, body } });
      setBody("");
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const remaining = MAX_BODY - body.length;
  const empty = body.trim().length === 0;

  return (
    <form onSubmit={submit} className="mt-6">
      <label htmlFor="comment-body" className="sr-only">Add a comment</label>
      <textarea
        id="comment-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={MAX_BODY}
        rows={3}
        placeholder="Tried it? Tell everyone how it went."
        className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
      />
      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <span className={`text-xs ${remaining < 50 ? "text-amber-300" : "text-white/50"}`}>
          {remaining} characters left
        </span>
        <button
          type="submit"
          disabled={loading || empty}
          className="rounded-md bg-white px-4 py-1.5 text-sm font-medium text-[#001357] hover:bg-white/90 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post comment"}
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-sm text-red-300">{error}</p>}
    </form>
  );
};

const LoginPrompt = () => {
  const { loginWithRedirect, isLoading } = useAuth0();
  const location = useLocation();
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-white/25 bg-white/5 px-4 py-3 text-sm text-white/80">
      <span>Sign in to join the conversation.</span>
      <button
        type="button"
        disabled={isLoading}
        onClick={() => loginWithRedirect({ appState: { returnTo: `${location.pathname}#comments` } })}
        className="rounded-md border border-white/30 px-3 py-1 font-medium text-white hover:bg-white/10 disabled:opacity-50"
      >
        Log in
      </button>
    </div>
  );
};

export default function Comments({ recipe }) {
  const { isAuthenticated } = useAuth0();
  const { data, loading, error, refetch } = useQuery(GET_RECIPE_COMMENTS, {
    variables: { slug: recipe.slug },
  });
  const comments = data?.getRecipeBySlug?.comments ?? [];
  const count = data?.getRecipeBySlug?.commentCount ?? recipe.commentCount;

  return (
    <section id="comments" className="mt-16 max-w-3xl border-t border-white/10 pt-10" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="text-xl font-semibold">
        {count} {count === 1 ? "comment" : "comments"}
      </h2>

      {loading && !data && <p className="mt-4 text-white/60">Loading comments...</p>}
      {error && (
        <p role="alert" className="mt-4 text-sm text-red-300">
          Couldn't load comments: {getErrorMessage(error)}{" "}
          <button type="button" onClick={() => refetch()} className="underline">Try again</button>
        </p>
      )}

      {data && comments.length === 0 && (
        <p className="mt-4 text-white/60">No comments yet. Be the first.</p>
      )}

      {comments.length > 0 && (
        <ul className="mt-6 space-y-5">
          {comments.map((c) => (
            <li key={c._id} className="flex gap-3">
              <Avatar author={c.author} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{c.author?.username ?? "Deleted user"}</span>
                    <time dateTime={c.createdAt} title={new Date(c.createdAt).toLocaleString()} className="ml-2 text-white/50">
                      {timeAgo(c.createdAt)}
                    </time>
                  </p>
                  {c.canDelete && <DeleteCommentButton comment={c} recipe={recipe} />}
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words leading-relaxed text-white/90">{c.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {isAuthenticated ? <CommentForm recipe={recipe} /> : <LoginPrompt />}
    </section>
  );
}
