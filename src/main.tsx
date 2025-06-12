import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { TooltipProvider } from './components/ui/tooltip.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="298483544989-79j1970tm0q2i8jjrn1rq4r7mrkptpgg.apps.googleusercontent.com" >
      <Provider store={store}>
        <TooltipProvider>

          <App />
        </TooltipProvider>

      </Provider>
    </GoogleOAuthProvider>

  </StrictMode>
);
