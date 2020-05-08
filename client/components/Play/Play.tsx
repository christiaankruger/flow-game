// The Right-Hand-Side of the game board
// Map is LHS

import React, { Component } from 'react';
import { createBemHelper } from '../../util/BEM';
import { formatMoney } from 'accounting';

import './Play.scss';
import { GameStore } from '../../store/GameStore';
import { Tab } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import { RouteGrid } from '../Routes/RouteGrid';

import './Play.scss';
const BEM = createBemHelper('play');

export interface IPlayProps {
  gameStore: GameStore;

  focusOnCity: (cityName: string) => void;
}

@observer
export class Play extends Component<IPlayProps> {
  render() {
    const { routes } = this.props.gameStore;
    return (
      <div>
        Timer: {this.props.gameStore.timerValue} || Money:{' '}
        {formatMoney(this.props.gameStore.money)}
        <div>
          <Tab
            menu={{ pointing: true }}
            panes={[
              {
                menuItem: 'Routes',
                render: () => (
                  // Looks like we're losing observability here, TODO: Confirm
                  <Tab.Pane attached={false}>
                    <RouteGrid
                      routes={routes}
                      onCityNameClick={(cityName: string) => {
                        this.props.focusOnCity(cityName);
                      }}
                    />
                  </Tab.Pane>
                )
              }
            ]}
          />
        </div>
        <div></div>
      </div>
    );
  }
}
