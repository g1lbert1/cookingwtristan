import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

// Vite inlines VITE_* vars into the client bundle, so these are public by
// design -- which is fine, an Auth0 domain and clientId are meant to be.
// Never put a real secret behind a VITE_ prefix.
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

if (!domain || !clientId || !audience) {
  throw new Error(
    'Missing Auth0 config. Copy .env.example to .env and fill in VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID and VITE_AUTH0_AUDIENCE.'
  );
}

// Must render inside <BrowserRouter>. The post-login redirect has to go
// through the router's navigate(): window.history.replaceState changes the
// URL bar but fires no popstate, so BrowserRouter kept rendering the
// pre-login route (Landing) while the address bar showed /admin/createRecipe.
const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname, { replace: true });
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
        scope: 'openid profile email',
      }}
      onRedirectCallback={onRedirectCallback}
      // Tokens live in localStorage so a reload does not start from an empty
      // cache. The in-memory cache was tried and reverted: every reload had to
      // re-authenticate through the hidden iframe, which fails when the browser
      // blocks third-party cookies, so users were bounced through a full login
      // (and, on localhost, Auth0's consent screen) on every refresh.
      //
      // Rotating refresh tokens renew expired access tokens without the
      // iframe. That needs "Allow Offline Access" on the API and "Refresh Token
      // Rotation" on the application in the Auth0 dashboard; until those are
      // on, the fallback uses the iframe flow only when a token has expired.
      cacheLocation="localstorage"
      useRefreshTokens
      useRefreshTokensFallback
    >
      {children}
    </Auth0Provider>
  );
};
export default Auth0ProviderWithNavigate;
