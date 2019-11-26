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
  state.currentInstrument = instrument;
  const preloadPromises = preloadInstrument(instrument);

  dom.pads.forEach(pad => {
    pad.classList.add('fx-grid__pad--loading');
  });

  preloadPromises.forEach(async (promise, padIndex) => {
    await promise;
    console.log('loaded: ', padIndex);
    dom.pads[padIndex].classList.remove('fx-grid__pad--loading');
  });
}
