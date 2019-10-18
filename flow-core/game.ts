import { Module, IRoute, ICity } from './types';
import { Player } from './player';
import { RouteModule } from './route_module';
import { Grid } from './grid';
import { CityModule } from './city_module';

const DEFAULT_SQUARE_SIZE = 25;

export interface IModuleRegistration {
  name: string;
  module: Module;
}

export interface CoreModules {
  city: CityModule;
  route: RouteModule;
}

export class Game {
  private adhocModules: IModuleRegistration[] = [];
  players: Player[] = [];
  routes: IRoute[] = [];
  cities: ICity[] = [];
  grid: Grid;

  constructor(
    public coreModules: CoreModules = {
      city: new CityModule(),
      route: new RouteModule()
    },
    rows: number = DEFAULT_SQUARE_SIZE,
    columns: number = DEFAULT_SQUARE_SIZE
  ) {
    this.grid = new Grid(rows, columns);
  }

  registerModule(moduleRegistration: IModuleRegistration) {
    this.adhocModules.push(moduleRegistration);
  }

  cityByName(name: string): ICity | undefined {
    return this.cities.find(c => c.name === name);
  }

  playerById(id: string): Player | undefined {
    return this.players.find(p => p.id === id);
  }

  tick() {
    // 1. Tick all the core modules
    Object.values(this.coreModules).forEach(module => module.tick(this));
    // 2. Tick all the adhoc modules
    this.adhocModules.forEach(registeredModule =>
      registeredModule.module.tick(this)
    );
  }
}

export const createGameWithSeeds = () => {
  const game = new Game();

  game.cities = CityModule.SeedCities(5, game);
  game.routes = RouteModule.SeedRoutes(3, game);

  return game;
};
