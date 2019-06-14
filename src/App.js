import React from 'react';
import './App.scss';
// import Metronome from './util/metronome';
import EventSequencer from './util/EventSequencer';

const startMetro = function() {
  if(!this.state.isPlaying) {
    metro.play();
  }
  else {
    metro.play();
  }

  this.setState({isPlaying: !this.state.isPlaying});
};

const context = new AudioContext();
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

const bd = getSynth(60, 'sine');
const snare = getSynth(700);

let metro;
class App extends React.Component {
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
      <div className="App">

        {this.state.isLoaded ? (
          <button
            ref={this.wheelRef}
            className={`play ${this.state.isPlaying ? 'active' : null}`}
            onClick={this.startMetro}
          >
            {this.state.isPlaying ? 'Playing―' : 'Start'}
          </button>
        ) : 'loading'}
      </div>
    );
  }

  componentDidMount() {

    // This will need to start looking like actual MIDI data eventually
    const sequencedEvents = {
      '1': [
        {
          instrument: 'bd',
          params: {
            vol: 0.1,
          },
        }
      ],
      '1.5': [
        {
          instrument: 'snare',
          params: {
            vol: 0.1,
          },
        }
      ],
      '2': [
        {
          instrument: 'snare',
          params: {
            vol: 0.1,
          },
        }
      ],
      '3': [
        {
          instrument: 'bd',
          params: {
            vol: 0.8,
          },
        }
      ],
      '4': [
        {
          instrument: 'snare',
          params: {
            vol: 0.1,
          },
        }
      ],
      'EOF': 5, // EOF is special to indicate the end of the sequence. This is the beat it restarts on.
    };

    const instruments = {
      bd: (params) => {
        bd.play(0.5, {
          attack: 0.001,
          sustain: 0.1,
          release: 0.4,
        });
        // setTimeout(() => {
          // this.wheelRef.current.classList.add('boom');
          // if(params.vol > 0.5) {
            // this.wheelRef.current.classList.add('strong');
          // }
        // }, 0);

        console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO');
      },
      snare: (params) => {
          snare.play(0.3, {
          attack: 0.001,
          sustain: 0.01,
          release: 0.04,
        });
        // setTimeout(() => {
          // this.wheelRef.current.classList.remove('boom', 'strong');
        // }, 0);

        console.log('++++++++++++++++++++++++++++');
      },
    };

    metro = EventSequencer({
      sequence: sequencedEvents,
      events: instruments,
      tempo: 190,
      loop: true,
    }, () => {
      this.setState({
        isLoaded: true,
      });
    });

    this.startMetro = startMetro.bind(this);
  }
};

export default App;

