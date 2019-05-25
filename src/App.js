import React from 'react';
import './App.scss';
import Metronome from './util/metronome';

const startMetro = () => {
  const metro = Metronome(new AudioContext());

  metro.play();
};

class App extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
    <div className="App">
      <button className="play" onClick={startMetro}>
        Start Metro
      </button>
    </div>
  );
  }
}

export default App;
