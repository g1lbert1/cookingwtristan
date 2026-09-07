import { useAuth0 } from "@auth0/auth0-react";
import { Link, NavLink } from "react-router-dom";

//Layout, left to right: Home | (spacer) | Profile | About (person icon).
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

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
  }`;

const Navigation = () => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  const login = () =>
    loginWithRedirect({ appState: { returnTo: "/profile" } });

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
        aria-label="Main"
      >
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
          ) : (
            <button
              type="button"
              onClick={login}
              disabled={isLoading}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              Log in
            </button>
          )}

          <Link
            to="/about"
            className="rounded-full p-2 text-gray-700 transition-colors hover:bg-gray-100"
            aria-label="About me"
            title="About me"
          >
            <PersonIcon />
          </Link>
        </div>
      </nav>
    </header>
  );
};
export default Navigation;
