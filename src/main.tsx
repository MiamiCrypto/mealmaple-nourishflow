
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Application starting to mount...");
console.log("Current URL:", window.location.href);
console.log("Base URL:", document.baseURI);

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("Root element found, mounting React app");
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found! Cannot mount React app");
}
