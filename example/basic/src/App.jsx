import React from 'react';

import logo from './assets/img/logo.svg';
import { SidePanel } from './components';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Hello</p>
          <div style={{ textAlign: 'left' }}>
            <small><em>Testing:</em></small>
            <ol>
              <li>Click the menu.</li>
              <li>Click a menu item, to navigate.</li>
              <li>Did the state re-load? Is the menu still open?</li>
              <li>Open a menu item in a new tab and close the menu.</li>
              <li>Is menu state synchronizing across tabs?</li>
              <li>Hit F12, see if logging and Redux devtools are working.</li>
            </ol>
          </div>
        </header>
        <SidePanel />
      </div>
    );
  }
}
export default App;
