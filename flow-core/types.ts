import { Game } from './game';

export interface IModule {
  tick: (game: Game) => void;
}

export class Module implements IModule {
  tick(game: Game) {
    throw new Error('Overwrite me!');
  }
}

export interface IPlayer {
  id: string;
  name: string;
  color: string;
  cities: ICity[];
}

export interface ITransaction {
  amount: number;
  description: string;
}

export interface ICity {
  name: string;

  // Coordinates
  coordinates: {
    row: number;
    column: number;
  };
}

export interface IBlock {
  // Better way?
  player_id?: string;
}

export interface IGrid {
  blocks: IBlock[][];
  // We assume a square, but just in case
  height: number;
  width: number;
}

export interface IRoute {
  from_city_name: string;
  to_city_name: string;
  income: number;
  expiring_in: number;
}
