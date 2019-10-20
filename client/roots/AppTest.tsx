import React, { Component } from 'react';
import { render } from 'react-dom';
import 'typeface-pt-serif';
import 'typeface-lato';
import 'semantic-ui-css/semantic.min.css';

import './AppTest.scss';
import { API } from './../util/API';
import { Grid } from '../../flow-core/grid';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { createBemHelper } from '../util/BEM';
import { GameMap } from '../map/game_map';

const BEM = createBemHelper('test');

// Build PIXI
const gameMap = new GameMap(
  {},
  {
    screenHeight: 500,
    screenWidth: 500
  }
);

const setGridCallback = (grid: Grid) => {
  gameMap.setGrid(grid);
};

@observer
class TestApp extends Component {
  @observable
  grid!: Grid;

  async componentDidMount() {
    this.updateGrid();
  }

  @action
  async updateGrid() {
    const newGrid = await API.generateTestGrid();
    this.grid = newGrid;
    setGridCallback(newGrid);
  }

  render() {
    return (
      <div>
        <div className={BEM('code')}>
          <pre>{JSON.stringify(this.grid, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

render(<TestApp />, document.getElementById('react-root'));

gameMap.bindToRoot('pixi-root');
