window.onload = boot;

const state = {
  currentInstrument: '',
};

const dom = {
  instruments: document.querySelector('.instruments'),
  grid: document.querySelector('.fx-grid'),
  pads: [],
  VUMeter: document.querySelector('.vu-meter'),
  VUMeterHand: document.querySelector('.vu-meter__hand'),
  VUHandAnimationTimeout: 0,
};

function boot() {
  registerServiceWorker();
  initDom();
}

async function initDom() {
  const instruments = await getInstrumentsFromAPI();
  selectInstrument(instruments[0]);
  createInstrumentOptions(instruments);
  setVULevel(0);
  createPads();
}

async function getInstrumentsFromAPI() {
  const res = await fetch('/hard-coded-api/instruments.json');
  const { instruments } = await res.json();
  return instruments;
}

function selectInstrument(instrument) {
  state.currentInstrument = instrument;
}

function setVULevel(level) {
  clearTimeout(dom.VUHandAnimationTimeout);
  dom.VUMeterHand.style.transition = 'transform 70ms';
  const angleRange = 60;
  const startAngle = -90 - angleRange / 2;
  const angle = startAngle + angleRange * level;
  dom.VUMeterHand.style.transform = `rotate(${angle}deg)`;

  dom.VUHandAnimationTimeout = setTimeout(() => {
    dom.VUMeterHand.style.transition = 'transform 700ms';
    dom.VUMeterHand.style.transform = `rotate(${startAngle}deg)`;
  }, 80);
}

function playFile(fileName) {
  new Howl({
    usingWebAudio: true,
    masterGain: true,
    src: [fileName],
    volume: 0.5,
  }).play();
}

function handlePadTrigger(index) {
  const fileName = `audio/${state.currentInstrument}-${index}.wav`;

  playFile(fileName);
}

function createInstrumentOptions(instruments) {
  dom.instruments.addEventListener('change', e => {
    const instrumentName = e.srcElement.value;
    selectInstrument(instrumentName);
  });

  instruments.forEach(instrumentName => {
    const option = document.createElement('option');
    option.value = instrumentName;
    option.innerHTML = instrumentName;
    dom.instruments.appendChild(option);
  });
}

function createPads() {
  const padCount = 4;
  const triggerEventNames = ['mousedown', 'touchstart'];
  const releaseEventNames = ['mouseleave', 'touchend', 'mouseup', 'touchleave'];

  dom.pads = [...Array(padCount)].map((_, padIndex) => {
    const pad = document.createElement('button');
    pad.classList.add('fx-grid__pad');

    triggerEventNames.forEach(eventName => {
      pad.addEventListener(eventName, e => {
        e.preventDefault();
        handlePadTrigger(padIndex);
        pad.classList.add('fx-grid__pad--active');
        setVULevel(1);
      });
    });

    releaseEventNames.forEach(eventName => {
      pad.addEventListener(eventName, () => {
        pad.classList.remove('fx-grid__pad--active');
      });
    });

    pad.addEventListener('touchmove', e => e.preventDefault());

    dom.grid.appendChild(pad);

    return pad;
  });
}
