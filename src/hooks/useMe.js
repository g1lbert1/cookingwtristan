import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@apollo/client/react";
import { GET_ME } from "../graphql/queries";

//The signed-in user's record from the API, or null. Skips the query until
//Auth0 has settled so an anonymous visitor never triggers a token request.
export const useMe = () => {
  const { isLoading: authLoading, isAuthenticated } = useAuth0();
  const { data, loading, error } = useQuery(GET_ME, {
    skip: authLoading || !isAuthenticated,
  });
  const me = isAuthenticated ? data?.me ?? null : null;
  const isAdmin = me?.role === "admin";

  //Mirrors the server rule: the poster or an admin may edit and delete.
  //Recipes without an author are the site's own and admin-only.
  const canManage = (recipe) =>
    Boolean(me) && (isAdmin || (recipe?.author?._id != null && recipe.author._id === me._id));

  return {
    me,
    isAdmin,
    canManage,
    loading: authLoading || loading,
    error,
  };
};
