function registerServiceWorker() {
  log('start registering service worker');
  const serviceWorkerSupported = 'serviceWorker' in navigator;

  if (serviceWorkerSupported) {
    log('registering at: ' + `${document.location.href}serviceWorker.js`);
    navigator.serviceWorker
      .register(`${document.location.href}serviceWorker.js`)
      .then(reg => console.log('service worker registered'))
      .catch(err => console.log('service worker not registered', err));
  }
}
