import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@scalewing/react/styles.css';

import { App } from './App.js';
import { AppShellFrame, appShellFrameQuery } from './frames/app-shell-frame.js';
import './gallery.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Missing #root');
}

// The AppShell section shows its frame in iframes of three widths: that
// query renders the frame alone, at the iframe's width.
const frame = window.location.search.slice(1) === appShellFrameQuery;

createRoot(root).render(
  <StrictMode>{frame ? <AppShellFrame /> : <App />}</StrictMode>,
);
