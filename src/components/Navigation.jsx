import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const { 
    isAuthenticated, 
    user, 
    loginWithRedirect: login, 
    logout: auth0Logout } = useAuth0();
  const signup = () =>
    login({ authorizationParams: { screen_hint: "signup" } });

  const logout = () =>
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });


  return (
    <nav className="flex justify-between p-4 border-b border-gray-200 items-center">
      <div className="flex gap-4">
        <Link to="/" className="font-bold">Home</Link>
        <Link to="/recipes" className="font-bold">Recipes</Link>
      </div>

      {/*Authentication Side*/}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <button onClick={logout} className="text-red px-4 py-2">Logout</button>
        ) : (
          <button onClick={login} className="text-green px-4 py-2">Login</button>
        )}
      </div>
    </nav>
  );
};
export default Navigation;
