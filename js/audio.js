function playFile(fileName) {
  new Howl({
    usingWebAudio: true,
    masterGain: true,
    src: [fileName],
    volume: 0.5,
  }).play();
}

function handlePadTrigger(index) {
  playFile(parseSamplePathName(state.currentInstrument, index));
}

function preloadInstrument(instrument) {
  return [...Array(4)].map(
    (_, index) =>
      new Promise(res => {
        const src = parseSamplePathName(instrument, index);
        const audio = new Audio(src);
        audio.addEventListener('canplaythrough', res);
      })
  );
}

function parseSamplePathName(instrumentName, index) {
  return `/audio/${instrumentName}-${index}.wav`;
}
