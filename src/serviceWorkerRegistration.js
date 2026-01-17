import { Workbox } from 'workbox-window';

export default function registerServiceWorker() {
  // Only register service worker in production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  // Check if the serviceWorker Object exists in the navigator object
  if ('serviceWorker' in navigator) {
    const wb = new Workbox('sw.js');

    wb.addEventListener('installed', event => {
      if (event.isUpdate) {
        if (confirm(`New app update is available!. Click OK to refresh`)) {
          window.location.reload();
        }
      }
    });

    wb.addEventListener('activated', event => {
      // Service worker activated
    });

    wb.addEventListener('waiting', event => {
      // New service worker is waiting
    });

    wb.addEventListener('message', event => {
      if (event.data && event.data.type === 'CACHE_UPDATED') {
        const { updatedURL } = event.data.payload;
        console.log(`A newer version of ${updatedURL} is available!`);
      }
    });

    wb.register().catch(error => {
      console.error('Service worker registration failed:', error);
    });
  }
}