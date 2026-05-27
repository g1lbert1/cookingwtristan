import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { Auth0Provider } from '@auth0/auth0-react';
import ApolloWrapper from './components/ApolloWrapper';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Auth0Provider
      domain="dev-5jcvwvffofu7udns.us.auth0.com"
      clientId="IwQeLeWC5LciAJuDz7XsmTc91Gqicjzm"
      authorizationParams={{ 
        redirect_uri: window.location.origin,
        audience: "https://cookingwtristan-api.com",
        scope: "openid profile email",
      }}
      onRedirectCallback={(appState) => {
        window.history.replaceState(
          {},
          document.title,
          appState?.returnTo || window.location.pathname
        );
      }}
      cacheLocation='localstorage'
    >
      <ApolloWrapper>
        <App />
      </ApolloWrapper>
    </Auth0Provider>
  </BrowserRouter>
);
