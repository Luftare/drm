async function registerServiceWorker() {
  const serviceWorkerSupported = 'serviceWorker' in navigator;

  if (serviceWorkerSupported) {
    try {
      await navigator.serviceWorker.register('serviceWorker.js');
      console.log('service worker registered');
    } catch (err) {
      console.warn('service worker not registered', err);
    }
  }
}
