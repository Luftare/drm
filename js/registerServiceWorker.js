function registerServiceWorker() {
  const serviceWorkerSupported = 'serviceWorker' in navigator;

  if (serviceWorkerSupported) {
    navigator.serviceWorker
      .register(`${document.location.href}serviceWorker.js`)
      .then(reg => console.log('service worker registered'))
      .catch(err => console.log('service worker not registered', err));
  }
}
