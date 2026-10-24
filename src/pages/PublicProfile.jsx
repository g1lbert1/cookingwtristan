import { Link, Navigate, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_USER_PROFILE } from "../graphql/queries";
import { getErrorMessage } from "../graphql/errors";
import { useMe } from "../hooks/useMe";
import { RecipeGrid } from "../components/RecipeCard";
import Seo from "../components/Seo";
import { profilePath } from "../usernameRules";

//Someone's public page at /u/:username: their name, avatar and recipes.
//Likes and favorites are private and stay on /profile. The viewer's own page
//renders the same way, with a line pointing at the editable profile, so
//they see exactly what others see.
//
//The name in the URL is matched case-insensitively, and a name given up in
//a recent rename still resolves to its old owner. In both cases the page
//moves to the canonical URL for the current name.

const HeaderSkeleton = () => (
  <div className="flex animate-pulse items-center gap-5" aria-hidden="true">
    <div className="h-20 w-20 shrink-0 rounded-full bg-white/10" />
    <div className="flex-1 space-y-3">
      <div className="h-8 w-48 max-w-full rounded bg-white/10" />
      <div className="h-4 w-32 max-w-full rounded bg-white/10" />
    </div>
  </div>
);

const PublicProfile = () => {
  const { username } = useParams();
  const { data, error, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { username },
    fetchPolicy: "cache-and-network",
  });
  const { me } = useMe();

  if (error) {
    return (
      <section className="max-w-xl">
        <Seo title="Profile" noindex />
        <div role="alert" className="alert-error">
          <p className="font-medium">Couldn't load this profile.</p>
          <p className="mt-1 text-sm text-red-200/80">{getErrorMessage(error)}</p>
          <button type="button" onClick={() => refetch()} className="btn btn-secondary btn-sm mt-3">
            Try again
          </button>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="panel p-6 sm:p-8" aria-busy="true">
        <Seo title="Profile" noindex />
        <HeaderSkeleton />
      </section>
    );
  }

  const user = data.user;

  if (!user) {
    return (
      <section className="max-w-xl">
        <Seo title="Profile not found" noindex />
        <h1 className="font-display text-4xl leading-none tracking-tight text-white sm:text-5xl">No one here</h1>
        <p className="mt-3 text-white/70">
          There is no <span className="font-medium text-white break-all">{username}</span> on the site. They may have changed their username, or the link may be mistyped.
        </p>
        <Link to="/recipes" className="btn btn-primary mt-6">Browse recipes</Link>
      </section>
    );
  }

  if (user.username !== username) {
    return <Navigate to={profilePath(user.username)} replace />;
  }

  const isMe = me?._id === user._id;
  const count = user.recipeCount;

  return (
    <>
      <Seo title={user.username} description={`Recipes shared by ${user.username} on Cooking with Tristan.`} />
      <section className="panel p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-5">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-20 w-20 shrink-0 rounded-full border border-white/40 object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/30 font-display text-3xl text-white">
                {user.username[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="font-display break-all text-4xl leading-none tracking-tight text-white sm:text-5xl">
                {user.username}
              </h1>
              <p className="mt-2 text-white/70">
                {count} {count === 1 ? "recipe" : "recipes"}
              </p>
              {isMe && (
                <p className="mt-1 text-sm text-white/60">
                  This is how others see you.{" "}
                  <Link to="/profile" className="underline decoration-white/40 underline-offset-4 hover:text-white hover:decoration-white">
                    Edit your profile
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="public-recipes-heading">
        <h2 id="public-recipes-heading" className="font-display text-3xl text-white">Recipes</h2>
        <div className="mt-6">
          {user.recipes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/25 p-8 text-center">
              <p className="text-white/70">
                {isMe ? "You haven't shared a recipe yet." : `${user.username} hasn't shared a recipe yet.`}
              </p>
              <Link to={isMe ? "/recipes/new" : "/recipes"} className="btn btn-primary mt-4">
                {isMe ? "Share your first recipe" : "Browse all recipes"}
              </Link>
            </div>
          ) : (
            <RecipeGrid recipes={user.recipes} />
          )}
        </div>
      </section>
    </>
  );
};
export default PublicProfile;
