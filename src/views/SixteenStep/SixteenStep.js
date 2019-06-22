import React from 'react';
import './SixteenStep.scss';
import EventSequencer from '../../util/EventSequencer';
  // This will need to start looking like actual MIDI data eventually
const emptyStepArray = new Array(16).fill(0);

const sequencedEvents = {
  '2': [
    {
      instrument: 'snare',
      params: {
        vol: 0.1,
        attack: 0.001,
        sustain: 0.01,
        release: 0.04,
      },
    }
  ],
  '6': [
    {
      instrument: 'snare',
      params: {
        vol: 0.1,
        attack: 0.001,
        sustain: 0.01,
        release: 0.04,
      },
    }
  ],
  '10': [
    {
      instrument: 'snare',
      params: {
        vol: 0.1,
        attack: 0.001,
        sustain: 0.01,
        release: 0.04,
      },
    }
  ],
  '14': [
    {
      instrument: 'snare',
      params: {
        vol: 0.1,
        attack: 0.001,
        sustain: 0.01,
        release: 0.04,
      },
    }
  ],
  'EOF': 16, // EOF is special to indicate the end of the sequence. This is the beat it restarts on.
};

const instruments = {
  bd: (params) => {
    bd.play(0.5, params);

    // console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
  },
  snare: (params) => {
    snare.play(0.3, params);

    // console.log('++++++++++++++++++++++++++++');
  },
};
let bd;
let snare;
const instrumentChannelMap = [{name: 'bd', instrument: bd}, {name: 'snare', instrument: snare}];

let context;
const getSynth = (freq, waveformType) => {

  const oscillator = context.createOscillator();

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
      gainNode.gain.setTargetAtTime(0.000001, context.currentTime + asr.sustain, asr.release );
    },
  };
};

const initializeAudio = () => {
  context = context ? context : new AudioContext();
  bd = getSynth(60, 'sine');
  snare = getSynth(700);
}

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

let metro;
class OP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      isPlaying: false,
      currentSoundChannel: 0,
    }

    this.wheelRef = React.createRef();

    this.enableSteps = emptyStepArray.map((empty, i) => () => this.enableStep(i));
  }

  render() {
    return (
      <div className="sixteenStep">

        <div className="sequence">
          {this.state.isLoaded ? this.getSequenceUI() : 'loading'}

          <button
            className={`playSequence ${this.state.isPlaying ? 'active' : null}`}
            onClick={this.startMetro}
          >
          </button>
        </div>
      </div>
    );
  }


  getSequenceUI() {
    return emptyStepArray.map((empty, i) => {
      return <button
        key={`seqButton${i}`}
        onClick={this.enableSteps[i]}
      >
      </button>
    });
  }

  enableStep(stepIndex) {
    console.log(stepIndex);
    const event = {
      instrument: instrumentChannelMap[this.state.currentSoundChannel].name,
      params: {
        vol: 0.1,
        attack: 0.001,
        sustain: 0.1,
        release: 0.1,
      },
    };

    if(sequencedEvents[stepIndex]) {
      sequencedEvents[stepIndex].push(event);
    }
    else {
      sequencedEvents[stepIndex] = [event];
    }
  }

  componentDidMount() {
    metro = EventSequencer({
      sequence: sequencedEvents,
      events: instruments,
      tempo: 120,
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
