import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../graphql/queries";
import Seo from "../components/Seo";

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
    <section className="max-w-xl">
      <Seo title="Profile" noindex />
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
  );
};
export default Profile;
