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
  [...Array(4)].forEach((_, index) => {
    const src = parseSamplePathName(instrument, index);
    new Audio(src);
  });
}

function parseSamplePathName(instrumentName, index) {
  return `audio/${instrumentName}-${index}.wav`;
}
