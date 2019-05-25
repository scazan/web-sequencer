import React from 'react';
import logo from './logo.svg';
import './App.css';
import Metronome from './util/metronome';

class App extends React.Component {
  constructor() {
    super();
    const metro = Metronome(new AudioContext());

    metro.play();
  }

  render() {
    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
  }
}

export default App;
