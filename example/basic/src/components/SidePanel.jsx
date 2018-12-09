import React from 'react';

export class SidePanel extends React.Component {

  toggleSideMenu = (e) => {
    e.preventDefault();
    const { actions: { toggleSidePanel } } = this.props;
    toggleSidePanel();
  };

  render() {
    const {
      isSidePanelOpen
    } = this.props;
    return (
      <div style={{
        backgroundColor: 'gray',
        color: 'white',
        position: 'absolute',
        top: 0,
        left: 0,
        height: isSidePanelOpen ? '100%' : '45px',
        minWidth: 280,
        overflowY: 'hidden',
        overflowX: '',
        textAlign: 'center',
      }}>
        <a
          className="App-link"
          href="/"
          onClick={this.toggleSideMenu}
          style={{ color: 'white' }}
        ><pre style={{ margin: 0 }}>
            {'--------------------------------------\n'}
            {'MENU\n--------------------------------------'}
          </pre></a>
        <p><a href="/" style={{ color: 'white' }}>Home</a></p>
        <p><a href="/settings" style={{ color: 'white' }}>Settings</a></p>
        <p><a href="/about" style={{ color: 'white' }}>About</a></p>
      </div>
    );
  }
}
