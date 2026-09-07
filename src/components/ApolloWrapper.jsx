import { useLayoutEffect } from 'react';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react'; // Pull directly from the react folder
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';

// Auth state mirrored for the link below, which lives outside React. The client
// is built exactly once: rebuilding it on every auth change threw away the
// cache and orphaned in-flight queries.
//
// canFetchToken matters as much as getToken. Asking the SDK for a token while
// nobody is signed in (or while it is still processing the login redirect)
// makes it try the hidden-iframe check, which fails with login_required when
// the browser blocks third-party cookies. On that error the SDK wipes its
// whole token cache, including a token the login just stored, so the very
// next authenticated request went out without a bearer token.
const auth = { getToken: null, canFetchToken: false };

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:4000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  if (!auth.canFetchToken || !auth.getToken) return { headers };
  try {
    const token = await auth.getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  } catch (e) {
    // Signed in according to Auth0, but no token could be produced. Surface
    // it: a silent fallback here shows up as a confusing "must be logged in"
    // from the API with nothing in the console.
    console.warn('Could not get an access token; sending request anonymously.', e);
    return { headers };
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const ApolloWrapper = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

  // Layout effect, not a plain effect: a child's useEffect (where Apollo
  // subscribes and fires the request) runs before a parent's useEffect, but
  // after every layout effect. This guarantees the flags are current before
  // any query in the tree goes out.
  useLayoutEffect(() => {
    auth.getToken = getAccessTokenSilently;
    auth.canFetchToken = !isLoading && isAuthenticated;
  }, [getAccessTokenSilently, isAuthenticated, isLoading]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default ApolloWrapper;
