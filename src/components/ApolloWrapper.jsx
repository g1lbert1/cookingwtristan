import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react'; // Pull directly from the react folder
import { setContext } from '@apollo/client/link/context';
import { useAuth0 } from '@auth0/auth0-react';

const ApolloWrapper = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();
  const httpLink = createHttpLink({
    uri: 'http://localhost:4000/graphql',
  });

  const authLink = setContext(async (_, {headers}) => {
    try{
      //Get the token from auth0
      const token = await getAccessTokenSilently();
      console.log(token);
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      };
    }catch (e){
      //for if the user isn't logged in, send headers as is
      return { headers };
    }
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
export default ApolloWrapper;
