import { Routes, Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import NavBar from './components/Navigation';
import Landing from './pages/Landing';
import Recipes from './pages/Recipes';
import Recipe from './pages/Recipe';
import Profile from './pages/Profile';
import About from './pages/About';
import CreateRecipe from './pages/CreateRecipe.jsx';
import EditRecipe from './pages/EditRecipe.jsx';
import { useMe } from './hooks/useMe';

//withAuthenticationRequired only checks for a login. Admin-only pages also need
//the role from `me`, otherwise any signed-in user sees the form and only finds
//out at submit time that the server returns FORBIDDEN.
const RequireAdmin = ({ children }) => {
  const { isAdmin, loading, error } = useMe();
  if(loading) return <p>Loading...</p>;
  if(error) return <p className="text-red-600">Couldn't verify your account: {error.message}</p>;
  if(!isAdmin){
    return (
      <div>
        <h2 className="text-xl font-bold">Admins only</h2>
        <p>Your account does not have permission to manage recipes.</p>
      </div>
    );
  }
  return children;
};

//withAuthenticationRequired's default returnTo is the current path, which is
//what we want for both admin routes (including the slug in the edit URL).
const ProtectedCreateRecipe = withAuthenticationRequired(() => (
  <RequireAdmin><CreateRecipe /></RequireAdmin>
));

const ProtectedEditRecipe = withAuthenticationRequired(() => (
  <RequireAdmin><EditRecipe /></RequireAdmin>
));

const ProtectedProfile = withAuthenticationRequired(Profile);

const App = () => {
  //Warms the Apollo cache once the session is known, so Profile, the admin
  //guard, and the list's admin controls all render from cache.
  useMe();

  return(
    <>
      <NavBar />
      <main className="mx-auto max-w-7xl p-6">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/:slug" element={<Recipe />} />
          <Route path="/profile" element={<ProtectedProfile />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/createRecipe" element={<ProtectedCreateRecipe />} />
          <Route path="/admin/editRecipe/:slug" element={<ProtectedEditRecipe />} />
        </Routes>
      </main>
    </>
  );
};
export default App;
