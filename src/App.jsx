import { Routes, Route, Outlet, Navigate, useParams } from 'react-router-dom';
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

//Posting and editing need a login, nothing more. Who may edit a given recipe
//is decided per recipe: EditRecipe checks canManage once it has loaded the
//recipe, and the server enforces the same rule on save.
//withAuthenticationRequired's default returnTo is the current path, which
//keeps the slug in the edit URL across the login round-trip.
const ProtectedCreateRecipe = withAuthenticationRequired(CreateRecipe);
const ProtectedEditRecipe = withAuthenticationRequired(EditRecipe);
const ProtectedProfile = withAuthenticationRequired(Profile);

//The admin-only paths from before sharing. Old bookmarks and links still land
//somewhere useful.
const LegacyEditRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/recipes/${slug}/edit`} replace />;
};

//Most pages sit in a centered column on the light background. The landing
//and recipe pages opt out and paint their own full-bleed backgrounds.
const Contained = () => (
  <div className="mx-auto w-full max-w-7xl p-6">
    <Outlet />
  </div>
);

const App = () => {
  //Warms the Apollo cache once the session is known, so Profile and the
  //per-recipe edit controls all render from cache.
  useMe();

  return(
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Contained />}>
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/recipes/new" element={<ProtectedCreateRecipe />} />
            <Route path="/recipes/:slug/edit" element={<ProtectedEditRecipe />} />
            <Route path="/profile" element={<ProtectedProfile />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/createRecipe" element={<Navigate to="/recipes/new" replace />} />
            <Route path="/admin/editRecipe/:slug" element={<LegacyEditRedirect />} />
          </Route>
          <Route path="/recipes/:slug" element={<Recipe />} />
        </Routes>
      </main>
    </div>
  );
};
export default App;
