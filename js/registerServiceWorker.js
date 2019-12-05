async function registerServiceWorker() {
  const serviceWorkerSupported = 'serviceWorker' in navigator;

  if (serviceWorkerSupported) {
    try {
      const registration = await navigator.serviceWorker.register(
        'serviceWorker.js'
      );
      console.log('service worker registered');
      registration.update(); // Check for service worker changes immediately (skip 24h wait)
    } catch (err) {
      console.warn('service worker not registered', err);
    }
  }
}
