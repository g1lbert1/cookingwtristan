import { useState } from 'react';
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
    }
  }
`;

const ProtectedCreateRecipe = 
  withAuthenticationRequired(CreateRecipe, {
    loginOptions: {
      appState: {
        returnTo: "/admin/createRecipe",
      },
    },
  });

const App = () => {
  const {
    isLoading: authLoading,
    isAuthenticated,
  } = useAuth0();

  const { data, loading: apolloLoading, error } = useQuery(GET_ME, {
    skip: authLoading || !isAuthenticated,
  });
  if(authLoading || apolloLoading) return <div>Loading...</div>
  if(error && isAuthenticated) return "ERROR Loading User Data";

  return(
    <>
      <NavBar />
      <main className="max-w-7xl mx-auto p-6">
        <div>
          {isAuthenticated && data?.me ? (
            <h1>Welcome back {data.me.username}!</h1>
          ) : (
            <h1>Please log in.</h1>
          )}
          <Routes>
            <Route path = "/" element={<Landing />} />
            <Route path = "/recipes" element={<Recipes />} />
            <Route path = "/recipes/:slug" element={<Recipe />} />
            <Route path = "/admin/createRecipe" element={<ProtectedCreateRecipe />} /> 
          </Routes>
        </div>
      </main>
    </>
  );
};
export default App;

