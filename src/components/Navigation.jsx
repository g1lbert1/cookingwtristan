import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";

//Layout, left to right: the cookingwtristan wordmark (home) | Profile.
//Recipes and About are reached from the home page panel. Profile doubles as
//the login button when nobody is signed in, so the bar keeps the same shape
//in both states and the login lands on the profile.

const PersonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

//White pill on the black bar; on the profile page itself it gets a ring so
//the current page is still identifiable.
const pillClass = ({ isActive }) =>
  `btn btn-primary ${isActive ? "ring-2 ring-white/50 ring-offset-2 ring-offset-black" : ""}`;

const Navigation = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, error } = useAuth0();

  //A failed login redirect (bad state, refused token exchange, misconfigured
  //tenant) is only reported through this value. Keep it visible in the
  //console so a silent failure can still be diagnosed.
  useEffect(() => {
    if (error) console.error("Auth0 login failed:", error);
  }, [error]);

  const login = () =>
    loginWithRedirect({ appState: { returnTo: "/profile" } });

  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-black">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3"
        aria-label="Main"
      >
        <NavLink
          to="/"
          end
          className="font-display text-2xl leading-none tracking-tight text-white transition-colors hover:text-white/75"
        >
          cookingwtristan
        </NavLink>

        {isAuthenticated ? (
          <NavLink to="/profile" className={pillClass}>
            <PersonIcon />
            Profile
          </NavLink>
        ) : (
          <button
            type="button"
            onClick={login}
            disabled={isLoading}
            className="btn btn-primary"
          >
            <PersonIcon />
            Log in
          </button>
        )}
      </nav>
    </header>
  );
};
export default Navigation;
