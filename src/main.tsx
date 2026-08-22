import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import App from './App';
import LoveLuxuryLoader from './components/LoveLuxuryLoader';
import './index.css';
import './luxury-upgrades.css';

function Root() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <LoveLuxuryLoader />}</AnimatePresence>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </>
  );
}

ReactDOM.createRoot(
  document.getElementById('root')!,
).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
);
