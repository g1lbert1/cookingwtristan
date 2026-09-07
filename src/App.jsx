import { Routes, Route } from 'react-router-dom';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useQuery } from '@apollo/client/react';
import NavBar from './components/Navigation';
import Landing from './pages/Landing';
import Recipes from './pages/Recipes';
import Recipe from './pages/Recipe';
import Profile from './pages/Profile';
import About from './pages/About';
import CreateRecipe from './pages/CreateRecipe.jsx';
import { GET_ME } from './graphql/queries';

//withAuthenticationRequired only checks for a login. Admin-only pages also need
//the role from `me`, otherwise any signed-in user sees the form and only finds
//out at submit time that the server returns FORBIDDEN.
const RequireAdmin = ({ children }) => {
  const { data, loading, error } = useQuery(GET_ME);
  if(loading) return <p>Loading...</p>;
  if(error) return <p className="text-red-600">Couldn't verify your account: {error.message}</p>;
  if(data?.me?.role !== "admin"){
    return (
      <div>
        <h2 className="text-xl font-bold">Admins only</h2>
        <p>Your account does not have permission to create recipes.</p>
      </div>
    );
  }
  return children;
};

const ProtectedCreateRecipe = withAuthenticationRequired(
  () => (
    <RequireAdmin>
      <CreateRecipe />
    </RequireAdmin>
  ),
  { loginOptions: { appState: { returnTo: "/admin/createRecipe" } } }
);

const ProtectedProfile = withAuthenticationRequired(Profile, {
  loginOptions: { appState: { returnTo: "/profile" } },
});

const App = () => {
  //Warms the Apollo cache once the session is known, so Profile and the
  //admin guard render from cache instead of each firing their own request.
  const { isLoading, isAuthenticated } = useAuth0();
  useQuery(GET_ME, { skip: isLoading || !isAuthenticated });

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
        </Routes>
      </main>
    </>
  );
};
export default App;
