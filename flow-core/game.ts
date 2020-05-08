import { Module, IRoute, ICity } from './types';
import { Player } from './player';
import { RouteModule } from './modules/route_module';
import { Grid } from './grid';
import { CityModule } from './modules/city_module';
import { terrainGenerator } from './terrain_generator';

export const DEFAULT_SQUARE_SIZE = 50;

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
  readonly cities: ICity[] = [];
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

  addCity(city: ICity) {
    const { row, column } = city.coordinates;
    this.cities.push(city);
    // Do this to maintain terrain
    const currentBlock = this.grid.blocks[row][column] || {};
    const newBlock = Object.assign({}, currentBlock, {
      belongsTo: {
        cityName: city.name
      }
    });

    this.grid.set(newBlock, row, column);
  }

  addPlayer(player: Player) {
    this.players.push(player);
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

export const createGameWithSeeds = (
  numberOfCities = 12,
  numberOfRoutes = 12
) => {
  const game = new Game();

  // 1. Generate terrains
  terrainGenerator(game.grid);

  // 2. Generate cities
  const cities = CityModule.SeedCities(numberOfCities, game);
  for (let city of cities) {
    game.addCity(city);
  }

  // 3. Generate routes
  game.routes = RouteModule.SeedRoutes(numberOfRoutes, game);
  return game;
};
