import React, { Component } from 'react';
import { render } from 'react-dom';
import socketConstructor from 'socket.io-client';
import { WelcomeScreen } from './components/Welcome/Welcome';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { HashRouter as Router } from 'react-router-dom';
import 'typeface-pt-serif';
import 'typeface-lato';
import 'semantic-ui-css/semantic.min.css';

import './index.scss';
import { WaitingScreen } from './components/Waiting/Waiting';
import { API } from './util/API';

const socket = socketConstructor();
// socket.on('')

export class App extends Component {
  ROUTES = {
    landing: '/',
    waiting: '/waiting',
    play: 'play'
  };

  landing = (route: RouteComponentProps) => {
    return (
      <WelcomeScreen
        onJoin={async (name: string) => {
          const result = await API.registerPlayer(name);
          route.history.push(this.ROUTES.waiting);
        }}
      />
    );
  };

  waiting = (route: RouteComponentProps) => {
    return <WaitingScreen />;
  };

  render() {
    return (
      <Router>
        <div className={'flow-captain__container'}>
          <Switch>
            <Route
              exact={true}
              path={this.ROUTES.landing}
              render={this.landing}
            />
            <Route path={this.ROUTES.waiting} render={this.waiting} />
          </Switch>
        </div>
      </Router>
    );
  }
}

render(<App />, document.getElementById('react-root'));
