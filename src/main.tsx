
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Enhanced debugging for custom domain issues
console.log("Application starting to mount...");
console.log("Current URL:", window.location.href);
console.log("Base URL:", document.baseURI);
console.log("Current hostname:", window.location.hostname);
console.log("Current pathname:", window.location.pathname);

// Create a meta tag to verify domain ownership if needed
const metaTag = document.createElement('meta');
metaTag.name = 'domain-verification';
metaTag.content = 'www.mealmaple.tech';
document.head.appendChild(metaTag);

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("Root element found, mounting React app");
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found! Cannot mount React app");
}
