export default function registerServiceWorker() {
  // Only register service worker in production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // Check if the serviceWorker Object exists in the navigator object
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker is available
                if (confirm('New app update is available!. Click OK to refresh')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
      });
  }
}