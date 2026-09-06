import { useEffect } from 'react';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react'; // Pull directly from the react folder
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';

// The current Auth0 token getter, kept module-scoped so the client below can be
// built exactly once. Rebuilding the client on every auth state change threw
// away the cache and orphaned in-flight queries.
let getToken = null;

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:4000/graphql',
});

const authLink = setContext(async (_, {headers}) => {
  if(!getToken) return { headers };
  try{
    //Get the token from auth0
    const token = await getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    };
  }catch {
    //for if the user isn't logged in, send headers as is
    return { headers };
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const ApolloWrapper = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getToken = getAccessTokenSilently;
  }, [getAccessTokenSilently]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default ApolloWrapper;
