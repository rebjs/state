import React, { Component } from 'react';

import logo from './assets/img/logo.svg';
import { SidePanel } from './components';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Hello</p>
        </header>
        <SidePanel />
      </div>
    );
  }
}

export default App;
