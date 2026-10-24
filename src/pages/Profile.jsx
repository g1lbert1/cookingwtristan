import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@apollo/client/react";
import { GET_ME, GET_MY_RECIPES } from "../graphql/queries";
import { RecipeGrid } from "../components/RecipeCard";
import Seo from "../components/Seo";

const TABS = [
  {
    key: "recipes",
    label: "My recipes",
    empty: "You haven't shared a recipe yet.",
    action: { to: "/recipes/new", label: "Share your first recipe" },
  },
  {
    key: "likedRecipes",
    label: "Liked",
    empty: "Recipes you like will show up here.",
    action: { to: "/recipes", label: "Browse recipes" },
  },
  {
    key: "favoriteRecipes",
    label: "Favorites",
    empty: "Favorite a recipe to keep it handy here.",
    action: { to: "/recipes", label: "Browse recipes" },
  },
];

//The three lists come from one query on `me`. The like and favorite buttons
//evict the matching list from the cached User after a change, which makes
//this query incomplete, so Apollo refetches it on its own.
const RecipeTabs = () => {
  const [active, setActive] = useState(TABS[0].key);
  const { data, loading, error, refetch } = useQuery(GET_MY_RECIPES);
  const tab = TABS.find((t) => t.key === active);
  const recipes = data?.me?.[active] ?? [];

  return (
    <section className="mt-12" aria-labelledby="profile-recipes-heading">
      <h2 id="profile-recipes-heading" className="sr-only">Your recipes</h2>
      <div role="tablist" aria-label="Your recipes" className="flex flex-wrap gap-1 border-b border-white/15">
        {TABS.map((t) => {
          const selected = t.key === active;
          const count = data?.me?.[t.key]?.length;
          return (
            <button
              key={t.key}
              id={`profile-tab-${t.key}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls="profile-tabpanel"
              onClick={() => setActive(t.key)}
              className={`-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                selected
                  ? "border-white text-white"
                  : "border-transparent text-white/55 hover:border-white/40 hover:text-white"
              }`}
            >
              {t.label}
              {count != null && (
                <span className={`ml-1.5 tabular-nums ${selected ? "text-white/60" : "text-white/50"}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        id="profile-tabpanel"
        role="tabpanel"
        aria-labelledby={`profile-tab-${active}`}
        aria-busy={loading && !data}
        className="mt-6"
      >
        {loading && !data && <p className="text-white/60">Loading your recipes...</p>}
        {error && (
          <div role="alert" className="alert-error">
            <p className="font-medium">Couldn't load your recipes.</p>
            <p className="mt-1 text-sm text-red-200/80">{error.message}</p>
            <button type="button" onClick={() => refetch()} className="btn btn-secondary btn-sm mt-3">
              Try again
            </button>
          </div>
        )}
        {data && recipes.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/25 p-8 text-center">
            <p className="text-white/70">{tab.empty}</p>
            <Link to={tab.action.to} className="btn btn-primary mt-4">
              {tab.action.label}
            </Link>
          </div>
        )}
        {recipes.length > 0 && <RecipeGrid recipes={recipes} />}
      </div>
    </section>
  );
};

//Shown while `me` is still on its way, so the page keeps its shape and the
//recipe tabs below can start loading at the same time.
const HeaderSkeleton = () => (
  <div className="flex animate-pulse items-center gap-5" aria-hidden="true">
    <div className="h-20 w-20 shrink-0 rounded-full bg-white/10" />
    <div className="flex-1 space-y-3">
      <div className="h-8 w-48 max-w-full rounded bg-white/10" />
      <div className="h-4 w-64 max-w-full rounded bg-white/10" />
    </div>
  </div>
);

const Profile = () => {
  const { logout: auth0Logout } = useAuth0();
  //Usually already in the cache: App warms this query as soon as the session
  //is known. On a cold load (straight after login) the header shows a
  //skeleton while it resolves, and the tabs' own query goes out alongside it
  //instead of waiting for this one to finish.
  const { data, loading, error } = useQuery(GET_ME);

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  const logoutButton = (
    <button type="button" onClick={logout} className="btn btn-secondary">
      Log out
    </button>
  );

  if (error) {
    // Keep a way out. A stale session is the usual cause, and logging out
    // then back in clears it.
    return (
      <section className="max-w-xl">
        <Seo title="Profile" noindex />
        <div role="alert" className="alert-error">
          <p className="font-medium">Couldn't load your profile.</p>
          <p className="mt-1 text-sm text-red-200/80">{error.message}</p>
        </div>
        <p className="mt-3 text-sm text-white/70">Try logging out and back in.</p>
        <div className="mt-4">{logoutButton}</div>
      </section>
    );
  }

  const me = data?.me;
  const joined = me?.createdAt ? new Date(me.createdAt).toLocaleDateString() : null;

  return (
    <>
      <Seo title="Profile" noindex />
      <section className="panel p-6 sm:p-8" aria-busy={loading && !me}>
        {!me ? (
          <HeaderSkeleton />
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              {me.avatar ? (
                <img
                  src={me.avatar}
                  alt=""
                  className="h-20 w-20 rounded-full border border-white/40 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/40 bg-black/30 font-display text-3xl text-white">
                  {me.username?.[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0">
                <h1 className="font-display text-4xl leading-none tracking-tight text-white sm:text-5xl">
                  {me.username}
                </h1>
                <p className="mt-2 truncate text-white/70">{me.email}</p>
                <p className="mt-1 text-sm text-white/60">
                  <span className="capitalize">{me.role}</span>
                  {joined && <> · Joined {joined}</>}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 sm:shrink-0">
              <Link to="/recipes/new" className="btn btn-primary">
                Share a recipe
              </Link>
              {logoutButton}
            </div>
          </div>
        )}
      </section>

      <RecipeTabs />
    </>
  );
};
export default Profile;
