import React, { Component } from 'react';
import { render } from 'react-dom';
import socketConstructor from 'socket.io-client';

const socket = socketConstructor();
socket.emit('join');

class App extends Component {
  render() {
    return <div>Hi!!</div>;
  }
}

render(<App />, document.getElementById('react-root'));
