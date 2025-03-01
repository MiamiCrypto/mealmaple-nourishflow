
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced debugging for MIME type issues
console.log("Application starting to mount...");
console.log("Current URL:", window.location.href);
console.log("Base URL:", document.baseURI);
console.log("Base path:", import.meta.env.BASE_URL);
console.log("JavaScript module test:", import.meta.url);
console.log("Current script MIME type:", document.currentScript?.type);

// Domain verification meta tag updated in head element
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded");
  console.log("Script elements:", document.querySelectorAll('script').length);
  console.log("Module scripts:", document.querySelectorAll('script[type="module"]').length);
});

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
