import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";

//Layout, left to right: Home | (spacer) | Recipes | Profile | About (person icon).
//Profile doubles as the login button when nobody is signed in, so the nav
//keeps the same shape in both states.

const PersonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-6 w-6"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

//Black bar, white pills with a drop shadow; the current page gets a thin
//dark ring so it is still identifiable.
const linkClass = ({ isActive }) =>
  `rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-md shadow-black/60 transition hover:bg-gray-200 hover:shadow-lg ${
    isActive ? "ring-2 ring-gray-400" : ""
  }`;

const Navigation = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const login = () =>
    loginWithRedirect({ appState: { returnTo: "/profile" } });

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
        aria-label="Main"
      >
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink to="/recipes" className={linkClass}>
            Recipes
          </NavLink>

          {isAuthenticated ? (
            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={login}
              disabled={isLoading}
              className={`${linkClass({ isActive: false })} disabled:opacity-50`}
            >
              Log in
            </button>
          )}

          <NavLink
            to="/about"
            className={linkClass}
            aria-label="About me"
            title="About me"
          >
            <PersonIcon />
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
export default Navigation;
