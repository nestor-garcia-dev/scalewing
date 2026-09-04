import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@scalewing/react/styles.css';

import { App } from './App.js';
import './gallery.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Missing #root');
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
