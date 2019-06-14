import React from 'react';
import './SixteenStep.scss';
import EventSequencer from '../../util/EventSequencer';
  // This will need to start looking like actual MIDI data eventually
const sequencedEvents = {
  '5': [
    {
      instrument: 'snare',
      params: {
        vol: 0.1,
      },
    }
  ],
  '13': [
    {
      instrument: 'snare',
      params: {
        vol: 0.1,
      },
    }
  ],
  'EOF': 17, // EOF is special to indicate the end of the sequence. This is the beat it restarts on.
};

const instruments = {
  bd: (params) => {
    bd.play(0.5, {
      attack: 0.001,
      sustain: 0.1,
      release: 0.4,
    });

    console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
  },
  snare: (params) => {
    snare.play(0.3, {
      attack: 0.001,
      sustain: 0.01,
      release: 0.04,
    });

    console.log('++++++++++++++++++++++++++++');
  },
};

const startMetro = function() {
  if(!this.state.isPlaying) {

    initializeAudio();
    metro.play();
  }
  else {
    metro.play();
  }

  this.setState({isPlaying: !this.state.isPlaying});
};

let context;
const getSynth = (freq, waveformType) => {

  const oscillator = context.createOscillator();
  // oscillator.type = this.config.waveformType);

  const gainNode = context.createGain();
  const panner = context.createStereoPanner();

  oscillator.connect(gainNode);
  gainNode.connect(panner);
  panner.connect(context.destination);

  oscillator.type = waveformType ? waveformType : 'triangle';
  gainNode.gain.value = 0;
  oscillator.frequency.value = freq;

  oscillator.start(0);
  return {
    play: (vol, asr) => {

      gainNode.gain.setTargetAtTime(vol, context.currentTime, asr.attack );
      // gainNode.gain.value = 0.4;
      gainNode.gain.setTargetAtTime(0.000001, context.currentTime + asr.sustain, asr.release );
    },
  };
};

let bd;
let snare;
const initializeAudio = () => {
  context = context ? context : new AudioContext();
  bd = getSynth(60, 'sine');
  snare = getSynth(700);
}

const enableStep = stepIndex => {
  if(sequencedEvents[stepIndex]) {
    sequencedEvents[stepIndex].push({
      instrument: 'bd',
      params: {
        vol: 0.1,
      },
    });
  }
  else {
    sequencedEvents[stepIndex] = [{
      instrument: 'bd',
      params: {
        vol: 0.1,
      },
    }];
  }
};

const emptyArray = new Array(16).fill(0);

const enableSteps = emptyArray.map((empty, i) => () => enableStep(i));

const getSequenceUI = () => {
  return emptyArray.map((empty, i) => {
    return <button
      key={`seqButton${i}`}
      onClick={enableSteps[i]}
    >
    </button>
  });
};

let metro;
class OP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      isPlaying: false,
    }

    this.wheelRef = React.createRef();
  }

  render() {
    return (
      <div className="sixteenStep">

        <div className="sequence">
          {this.state.isLoaded ? getSequenceUI() : 'loading'}

          <button
            className={`playSequence ${this.state.isPlaying ? 'active' : null}`}
            onClick={this.startMetro}
          >
          </button>
        </div>
      </div>
    );
  }

  componentDidMount() {
    metro = EventSequencer({
      sequence: sequencedEvents,
      events: instruments,
      tempo: 220,
      loop: true,
    }, () => {
      this.setState({
        isLoaded: true,
      });
    });

    this.startMetro = startMetro.bind(this);
  }
};

export default OP;
