import React from 'react';
import Tone from 'tone';
import './Sequencer.scss';
  // This will need to start looking like actual MIDI data eventually
const emptyStepArray = new Array(16).fill(0);

// Sequenced events need to be grouped by channel instead of flat like this (it can be flattened in/before the event sequencer)
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

const startTransport = function() {
  if(!this.state.isPlaying) {
    var synth = new Tone.Synth().toMaster();
    const loop = new Tone.Loop(function(time){
      synth.triggerAttackRelease("C3", "8n", time);
    }, "4n");
    loop.start("1m").stop("4m");

    Tone.Transport.start();
  }
  else {
    Tone.Transport.stop();
  }

  this.setState({isPlaying: !this.state.isPlaying});
};

class OP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      isPlaying: false,
      currentSoundChannel: 1,
    }

    this.enableSteps = emptyStepArray.map((empty, i) => () => this.enableStep(i));
  }

  render() {
    return (
      <div className="sixteenStep">

        <div className="sequence">
          {this.state.isLoaded ? this.getSequenceUI() : 'loading'}

          <button
            className={`playSequence ${this.state.isPlaying ? 'active' : null}`}
            onClick={this.startTransport}
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
    const event = {
      // instrument: instrumentChannelMap[this.state.currentSoundChannel].name,
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
    this.setState({
      isLoaded: true,
    });

    this.startTransport = startTransport.bind(this);
  }
};

export default OP;
