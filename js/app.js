window.onload = boot;

const state = {
  currentInstrument: '',
};

async function boot() {
  registerServiceWorker();
  const instruments = await getInstrumentsFromAPI();
  initDom(instruments);
  selectInstrument(instruments[0]);
}

async function getInstrumentsFromAPI() {
  const res = await fetch(
    `${document.location.href}hard-coded-api/instruments.json`
  );
  const { instruments } = await res.json();
  return instruments;
}

function selectInstrument(instrument) {
  state.currentInstrument = instrument;
  preloadInstrument(instrument);
}
