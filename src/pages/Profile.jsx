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
    <section className="mt-10" aria-labelledby="profile-recipes-heading">
      <h2 id="profile-recipes-heading" className="sr-only">Your recipes</h2>
      <div role="tablist" aria-label="Your recipes" className="flex flex-wrap gap-2 border-b border-gray-200">
        {TABS.map((t) => {
          const selected = t.key === active;
          const count = data?.me?.[t.key]?.length;
          return (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setActive(t.key)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium transition ${
                selected
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {t.label}
              {count != null && <span className="ml-1.5 tabular-nums text-gray-400">{count}</span>}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="mt-6">
        {loading && !data && <p className="text-gray-600">Loading...</p>}
        {error && (
          <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4">
            <p className="font-medium text-red-700">Couldn't load your recipes.</p>
            <p className="mt-1 text-sm text-red-600">{error.message}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Try again
            </button>
          </div>
        )}
        {data && recipes.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <p className="text-gray-600">{tab.empty}</p>
            <Link
              to={tab.action.to}
              className="mt-4 inline-block rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              {tab.action.label}
            </Link>
          </div>
        )}
        {recipes.length > 0 && <RecipeGrid recipes={recipes} />}
      </div>
    </section>
  );
};

const Profile = () => {
  const { logout: auth0Logout } = useAuth0();
  const { data, loading, error } = useQuery(GET_ME);

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });

  const logoutButton = (
    <button
      type="button"
      onClick={logout}
      className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
    >
      Log out
    </button>
  );

  if (loading) return <p className="text-gray-600">Loading your profile...</p>;
  if (error) {
    // Keep a way out. A stale session is the usual cause, and logging out
    // then back in clears it.
    return (
      <section className="max-w-xl">
        <p role="alert" className="text-red-600">
          Couldn't load your profile: {error.message}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Try logging out and back in.
        </p>
        <div className="mt-4">{logoutButton}</div>
      </section>
    );
  }

  const me = data?.me;
  const joined = me?.createdAt ? new Date(me.createdAt).toLocaleDateString() : null;

  return (
    <>
      <Seo title="Profile" noindex />
      <section className="max-w-xl">
        <div className="flex items-center gap-4">
          {me?.avatar ? (
            <img
              src={me.avatar}
              alt=""
              className="h-16 w-16 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold text-gray-600">
              {me?.username?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{me?.username}</h1>
            <p className="text-gray-600">{me?.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="font-medium text-gray-500">Role</dt>
          <dd className="capitalize text-gray-900">{me?.role}</dd>
          {joined && (
            <>
              <dt className="font-medium text-gray-500">Joined</dt>
              <dd className="text-gray-900">{joined}</dd>
            </>
          )}
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/recipes/new"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Share a recipe
          </Link>
          {logoutButton}
        </div>
      </section>

      <RecipeTabs />
    </>
  );
};
export default Profile;
