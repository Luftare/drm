window.onload = boot;

const state = {
  currentInstrument: '',
};

async function boot() {
  registerServiceWorker();
  const instruments = await getInstrumentsFromAPI();
  initDom(instruments);

  const defaultInstrument = instruments[0];
  if (defaultInstrument) {
    selectInstrument(defaultInstrument);
  }
}

async function getInstrumentsFromAPI() {
  const res = await fetch(
    `${document.location.href}hard-coded-api/instruments.json`
  );
  const { instruments } = await res.json();
  return instruments;
}

async function selectInstrument(instrument) {
  showLoader();
  state.currentInstrument = instrument;
  const preloadPromises = preloadInstrument(instrument);
  await Promise.all(preloadPromises);
  hideLoader();
}
