import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Auth0ProviderWithNavigate from './components/Auth0ProviderWithNavigate';
import ApolloWrapper from './components/ApolloWrapper';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <ApolloWrapper>
          <App />
        </ApolloWrapper>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </StrictMode>
);
