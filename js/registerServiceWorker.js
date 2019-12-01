async function registerServiceWorker() {
  const serviceWorkerSupported = 'serviceWorker' in navigator;

  if (serviceWorkerSupported) {
    const registration = await navigator.serviceWorker.register('serviceWorker.js');
    registration.update(); // Check for service worker changes immediately (skip 24h wait)
  }
}
