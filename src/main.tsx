
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("Application starting to mount...");
console.log("CSS should be loaded from index.css");

// Add a check to see if Tailwind classes are working
document.addEventListener('DOMContentLoaded', () => {
  const testElement = document.createElement('div');
  testElement.className = 'hidden bg-primary text-primary-foreground';
  document.body.appendChild(testElement);
  
  const styles = window.getComputedStyle(testElement);
  console.log("Tailwind test - bg-primary color:", styles.backgroundColor);
  console.log("Tailwind test - text color:", styles.color);
  
  // Clean up
  document.body.removeChild(testElement);
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
