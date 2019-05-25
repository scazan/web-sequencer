import React from 'react';
import './App.scss';
import Metronome from './util/metronome';

const startMetro = function() {
  if(!this.state.isPlaying) {
    metro.play();
  }
  else {
    metro.play();
  }

  this.setState({isPlaying: !this.state.isPlaying});
};

const setOutput = function(e) {
  const outputId = e.target.value;
  console.log(outputId);
  metro.setOutput(outputId);
};

let metro;
class App extends React.Component {
  constructor(props) {
    super(props);

    metro = Metronome(new AudioContext(), () => {
      this.setState({
        isLoaded: true,
        midiOutputs: metro.midi.outputs,
      });
    });

    this.state = {
      isLoaded: false,
      isPlaying: false,
      midiOutputs: [],
    };

    this.startMetro = startMetro.bind(this);
    this.setOutput = setOutput.bind(this);
  }

  render() {
    return (
      <div className="App">
        <select onChange={this.setOutput}>
          <option value={null} selected disabled>Select a MIDI output device</option>
          {this.state.midiOutputs.map( output =>
            <option value={output.id}>
              {output.name}
            </option>
          )}
        </select>

        {this.state.isLoaded ? (
          <button className={`play ${this.state.isPlaying ? 'active' : null}`} onClick={this.startMetro}>
            {this.state.isPlaying ? 'Stop' : 'Start Metro'}
          </button>
        ) : 'loading'}
      </div>
    );
  }
};

export default App;
