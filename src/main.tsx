
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
  
  // Force a repaint to ensure styles are applied
  document.body.style.display = 'none';
  document.body.offsetHeight; // Trigger a reflow
  document.body.style.display = '';
  
  // Inject a CSS check element
  const styleCheck = document.createElement('div');
  styleCheck.id = 'css-check';
  styleCheck.style.position = 'fixed';
  styleCheck.style.bottom = '0';
  styleCheck.style.right = '0';
  styleCheck.style.zIndex = '9999';
  styleCheck.style.background = 'rgba(0,0,0,0.7)';
  styleCheck.style.color = 'white';
  styleCheck.style.padding = '4px 8px';
  styleCheck.style.fontSize = '10px';
  styleCheck.style.borderRadius = '4px 0 0 0';
  styleCheck.textContent = 'CSS Loaded';
  
  // Remove after 5 seconds in production
  if (location.hostname !== 'localhost') {
    setTimeout(() => {
      if (styleCheck.parentNode) {
        styleCheck.parentNode.removeChild(styleCheck);
      }
    }, 5000);
  }
  
  document.body.appendChild(styleCheck);
});

// Reporting any JavaScript errors that might occur during initialization
window.addEventListener('error', function(e) {
  console.error('Global error caught:', e.message, 'at', e.filename, ':', e.lineno);
  
  // Create a visible error element in production for debugging
  if (location.hostname !== 'localhost') {
    const errorEl = document.createElement('div');
    errorEl.style.position = 'fixed';
    errorEl.style.top = '20px';
    errorEl.style.left = '20px';
    errorEl.style.right = '20px';
    errorEl.style.background = 'rgba(255,0,0,0.1)';
    errorEl.style.color = 'red';
    errorEl.style.padding = '10px';
    errorEl.style.zIndex = '9999';
    errorEl.style.borderRadius = '4px';
    errorEl.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    errorEl.style.fontSize = '12px';
    errorEl.textContent = `Error: ${e.message}`;
    document.body.appendChild(errorEl);
    
    // Remove after 10 seconds
    setTimeout(() => {
      if (errorEl.parentNode) {
        errorEl.parentNode.removeChild(errorEl);
      }
    }, 10000);
  }
});

const rootElement = document.getElementById("root");
if (rootElement) {
  console.log("Root element found, mounting React app");
  createRoot(rootElement).render(<App />);
} else {
  console.error("Root element not found! Cannot mount React app");
  
  // Create a visible error if root element is missing
  const errorEl = document.createElement('div');
  errorEl.style.padding = '20px';
  errorEl.style.margin = '20px';
  errorEl.style.background = '#f8d7da';
  errorEl.style.color = '#721c24';
  errorEl.style.borderRadius = '4px';
  errorEl.innerHTML = '<h2>Application Error</h2><p>Root element not found. Please refresh the page or contact support.</p>';
  document.body.appendChild(errorEl);
}
