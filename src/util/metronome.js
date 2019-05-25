import MetronomeWorker from './metronome.worker';
import WebMidi from 'webmidi';

let audioContext;
let isPlaying = false;      // Are we currently playing?
let current16thNote;        // What note is currently last scheduled?
let tempo = 120.0;          // tempo (in beats per minute)
let lookahead = 25.0;       // How frequently to call scheduling function 
                            //(in milliseconds)
let scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps 
                            // with next interval (in case the timer is late)
let nextNoteTime = 0.0;     // when the next note is due.
let noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
const notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
let timerWorker;     // The Web Worker used to fire timer messages


function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT 
                                          // tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote == 16) {
        current16thNote = 0;
    }
}

function scheduleNote( beatNumber, time ) {
  let nextNote;
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );

    if ( (noteResolution === 1) && (beatNumber%2))
        return; // we're not playing non-8th 16th notes
    if ( (noteResolution === 2) && (beatNumber%4))
        return; // we're not playing non-quarter 8th notes

    // create an oscillator
    // var osc = audioContext.createOscillator();
    // osc.connect( audioContext.destination );
  if (beatNumber % 16 === 0) {    // beat 0 == high pitch
    // osc.frequency.value = 880.0;
    nextNote = 'Eb3';
  }
  else if (beatNumber % 4 === 0 ) {    // quarter notes = medium pitch
    // osc.frequency.value = 440.0;
    nextNote = 'C3';
  }
  else  {                       // other 16th notes = low pitch
    nextNote = null;
    // osc.frequency.value = 220.0;
  }

  if(output && nextNote) {
    output.stopNote('C3');
    output.stopNote('Eb3');
    output.playNote(nextNote, 1, {duration: 400, velocity: Math.random()});
    // osc.start( time );
    // osc.stop( time + noteLength );
  }
}

function scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
    scheduleNote( current16thNote, nextNoteTime );
    nextNote();
  }
}

const play = () => {
    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
        current16thNote = 0;
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}

const setOutput = (outputId) => {
  if(outputId) {
    output = WebMidi.getOutputById(outputId);
  }
};

let output;
const init = (context, readyCallback) => {
  audioContext = context;

  timerWorker = new MetronomeWorker();

  timerWorker.addEventListener('message', function(e) {
    if (e.data == "tick") {
      // console.log("tick!");
      scheduler();
    }
    else
      console.log("message: " + e.data);
  });

  timerWorker.postMessage({"interval": lookahead});

  WebMidi.enable(function (err) {
    console.log("READY");

    readyCallback();
  });

  return {
    play,
    setOutput,
    midi: WebMidi,
  };
};

export default init;
