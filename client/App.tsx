import React, { Component } from 'react';
import { render } from 'react-dom';
import { WelcomeScreen } from './components/Welcome/Welcome';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { HashRouter as Router } from 'react-router-dom';
import 'typeface-pt-serif';
import 'typeface-lato';
import 'semantic-ui-css/semantic.min.css';
import SocketIO from 'socket.io-client';

import './index.scss';
import { WaitingScreen } from './components/Waiting/Waiting';
import { API } from './util/API';
import {
  COMMANDS,
  PlayerIDProps,
  GAME_EVENTS,
  ACTIONS,
  RoadProps
} from '../common/types';
import { GameMap } from './map/game_map';
import { Play } from './components/Play/Play';
import { Grid } from '../flow-core/grid';
import { GameStore } from './store/GameStore';
import { IRoute, IPlayer, ICity } from '../flow-core/types';
import { Player } from '../flow-core/player';
import { observer } from 'mobx-react';

const socket = SocketIO();
const gameStore = new GameStore();
(window as any).GameStore = gameStore;

const gameMap = new GameMap(
  {},
  {
    screenHeight: window.innerHeight,
    screenWidth: window.innerWidth / 2
  },
  (i: number, j: number) => {
    // On Click
    socket.emit(ACTIONS.ROAD, {
      column: i,
      row: j,
      playerId: gameStore.playerId,
      tickId: gameStore.currentTickId
    } as RoadProps);
  }
);

socket.on(GAME_EVENTS.GRID, (grid: Grid) => {
  gameMap.setGrid(grid);
});

socket.on(GAME_EVENTS.ROUTES, (routes: IRoute[]) => {
  gameStore.setRoutes(routes);
});

socket.on(GAME_EVENTS.PLAYER, (player: IPlayer) => {
  gameStore.setTransactions(player.transactions);
});

socket.on(GAME_EVENTS.CITIES, (cities: ICity[]) => {
  gameStore.setCities(cities);
});

socket.on(GAME_EVENTS.TICK, (tickId: string) => {
  gameStore.setCurrentTickId(tickId);
  gameStore.resetTimer();
});

socket.on(COMMANDS.DEBUG, (data: any) => {
  console.log('Debug', data);
});

@observer
export class App extends Component {
  ROUTES = {
    landing: '/',
    waiting: '/waiting',
    play: '/play'
  };

  private landing = (route: RouteComponentProps) => {
    return (
      <WelcomeScreen
        onJoin={async (name: string) => {
          socket.emit(COMMANDS.PLAYER_REGISTRATION, {
            name
          });
          socket.on(COMMANDS.PLAYER_ID, (props: PlayerIDProps) => {
            gameStore.playerId = props.playerId;
            route.history.push(this.ROUTES.waiting);
          });
        }}
      />
    );
  };

  private waiting = (route: RouteComponentProps) => {
    socket.on(COMMANDS.START_GAME, () => {
      route.history.push(this.ROUTES.play);
      gameMap.bindToRoot('pixi-root');
    });
    return <WaitingScreen />;
  };

  private play = (route: RouteComponentProps) => {
    return (
      <Play
        gameStore={gameStore}
        focusOnCity={(cityName: string) => {
          const coordinates = gameStore.cityByName(cityName).coordinates;
          gameMap.focusAtBlockCoordinates(coordinates.row, coordinates.column);
        }}
      />
    );
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
            <Route path={this.ROUTES.play} render={this.play} />
          </Switch>
        </div>
      </Router>
    );
  }
}
render(<App />, document.getElementById('react-root'));
