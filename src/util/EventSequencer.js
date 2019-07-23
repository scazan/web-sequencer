import MetronomeWorker from './metronome.worker';

let isPlaying = false;      // Are we currently playing?
// let lookahead = 16.0;       // How frequently to call scheduling function in ms
// let lookahead = 31.25;       // How frequently to call scheduling function in ms
let timerWorker;     // The Web Worker used to fire timer messages

const play = () => {
  isPlaying = !isPlaying;

  if (isPlaying) { // start playing
    timerWorker.postMessage("start");
    return "stop";
  } else {
    stop();
    return "play";
  }
};

const stop = () => {
  timerWorker.postMessage("stop");
  currentTickCount = 0;
};

const playScheduledEvents = (tickCount, sequence, actions) => {
  const currentBeat = (tickCount/(32*4)) * 4;
  const eventsToPlay = sequence[currentBeat];
  if(eventsToPlay && eventsToPlay.length) {
    console.log('- ', currentBeat);
    eventsToPlay.forEach(event => actions[event.instrument](event.params));
  }
  else {
    if(currentBeat === 0) {
      console.log('X ', currentBeat, sequence);
    }
  }
};

const setTempo = newTempo => {
  const lookahead = (((60/1920) / (newTempo/60)) * 1000); // 1920 32nd notes in a minute at 60bpm
  timerWorker.postMessage({"interval": lookahead});
};

let currentTickCount = 0;
let sequenceLength = 0;
const createSequencer = (options, readyCallback) => {
  const {
    sequence,
    events,
    loop,
    tempo=60,
  } = options;
  timerWorker = new MetronomeWorker();
  setTempo(tempo);
  sequenceLength = (sequence.EOF) * 32; // Why am I multiplying here?

  timerWorker.addEventListener('message', function(e) {
    if (e.data === "tick") {
      if(loop) {
        playScheduledEvents(currentTickCount % sequenceLength, sequence, events);
        currentTickCount++;
      }
      else {
        playScheduledEvents(currentTickCount, sequence, events);
        if(sequenceLength <= currentTickCount) {
          stop();
        }
        currentTickCount++;
      }
    }
    else {
      console.log("message: " + e.data);
    }
  });

  readyCallback();

  return {
    play,
    setTempo,
  };
};

export default createSequencer;
