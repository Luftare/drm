const dom = {
  instruments: document.querySelector('.instruments'),
  grid: document.querySelector('.fx-grid'),
  pads: [],
  VUMeter: document.querySelector('.vu-meter'),
  VUMeterHand: document.querySelector('.vu-meter__hand'),
  VUHandAnimationTimeout: 0,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

async function initDom(instruments) {
  window.addEventListener('resize', handleResize);
  handleResize();
  createInstrumentOptions(instruments);
  setVULevel(0);
  createPads();
  initKeyboard();
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
    dom.pads[padIndex] = pad;

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

function initKeyboard() {
  const bindMap = ['qwert', 'yuiopå', 'asdfg', 'hjklöä'];

  window.addEventListener('keydown', e => {
    const keyDown = e.key.toLowerCase();
    const index = bindMap.reduce(
      (acc, keys, i) => (keys.includes(keyDown) ? i : acc),
      0
    );
    handlePadTrigger(index);
    setVULevel(1);
  });
}

function handleResize() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}