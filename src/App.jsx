import { Routes, Route } from 'react-router-dom';
import Recipe from './pages/Recipe';
import Recipes from './pages/Recipes';
import Landing from './pages/Landing';
import NavBar from './components/Navigation';
import CreateRecipe from './pages/CreateRecipe.jsx';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      role
    }
  }
`;

//withAuthenticationRequired only checks for a login. Admin-only pages also need
//the role from `me`, otherwise any signed-in user sees the form and only finds
//out at submit time that the server returns FORBIDDEN.
const RequireAdmin = ({ me, loading, error, children }) => {
  if(loading) return <p>Loading...</p>;
  if(error) return <p className="text-red-600">Couldn't verify your account: {error.message}</p>;
  if(me?.role !== "admin"){
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
  ({ me, loading, error }) => (
    <RequireAdmin me={me} loading={loading} error={error}>
      <CreateRecipe />
    </RequireAdmin>
  ),
  {
    loginOptions: {
      appState: {
        returnTo: "/admin/createRecipe",
      },
    },
  }
);

//Only the greeting depends on GET_ME, so a failure there is rendered in place
//instead of replacing the whole page. The nav and routes always mount.
const Greeting = ({ authLoading, apolloLoading, error, isAuthenticated, me }) => {
  if(authLoading || apolloLoading) return <p>Loading...</p>;
  if(error && isAuthenticated){
    return (
      <p className="text-red-600">
        Couldn't load your profile: {error.message}
      </p>
    );
  }
  if(isAuthenticated && me) return <h1>Welcome back {me.username}!</h1>;
  return <h1>Please log in.</h1>;
};

const App = () => {
  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuth0();

  const { data, loading: apolloLoading, error } = useQuery(GET_ME, {
    skip: authLoading || !isAuthenticated,
  });

  return(
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto p-6">
        <div>
          <Greeting
            authLoading={authLoading}
            apolloLoading={apolloLoading}
            error={error}
            isAuthenticated={isAuthenticated}
            me={data?.me}
          />
          <Routes>
            <Route path = "/" element={<Landing />} />
            <Route path = "/recipes" element={<Recipes />} />
            <Route path = "/recipes/:slug" element={<Recipe />} />
            <Route
              path = "/admin/createRecipe"
              element={<ProtectedCreateRecipe me={data?.me} loading={apolloLoading} error={error} />}
            />
          </Routes>
        </div>
      </main>
    </>
  );
};
export default App;
