
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Application starting to mount...");

// Reporting any JavaScript errors that might occur during initialization
window.addEventListener('error', function(e) {
  console.error('Global error caught:', e.message, 'at', e.filename, ':', e.lineno);
});

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("Root element found, mounting React app");
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found! Cannot mount React app");
}
