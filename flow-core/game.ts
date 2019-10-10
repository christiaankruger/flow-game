import { Module, IRoute, ICity } from './types';
import { Player } from './player';
import { RouteModule } from './route_module';
import { Grid } from './grid';

const DEFAULT_SQUARE_SIZE = 25;

export class Game {
  private modules: Module[] = [];
  players: Player[] = [];
  routes: IRoute[] = [];
  cities: ICity[] = [];
  grid: Grid;

  constructor(
    rows: number = DEFAULT_SQUARE_SIZE,
    columns: number = DEFAULT_SQUARE_SIZE
  ) {
    this.grid = new Grid(rows, columns);
  }

  registerModule(module: Module) {
    this.modules.push(module);
  }

  tick() {
    this.modules.forEach(module => module.tick(this));
  }
}

export const createGameWithModules = () => {
  const game = new Game();
  game.registerModule(new RouteModule());
  return game;
};
