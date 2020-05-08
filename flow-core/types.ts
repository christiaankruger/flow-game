import { Game } from './game';

export enum CityType {
  CITY,
  CAPITAL
}

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
  transactions: ITransaction[];
}

export interface ITransaction {
  amount: number;
  description: string;
}

export interface ICity {
  name: string;
  type?: CityType;

  // Coordinates
  coordinates: {
    row: number;
    column: number;
  };
}

export interface IBlock {
  belongsTo?: BelongsToType;
  terrain?: TerrainType;
}

export type BelongsToType = ByPlayer | ByCity | ByObstacle;

export type ByPlayer = {
  playerId: string;
};

export type ByCity = {
  cityName: string;
};

export type TerrainType =
  | 'grass'
  | 'sand'
  | 'ground'
  | 'ice'
  | 'light-ground'
  | 'gravel';

export type ByObstacle = {
  obstacleType: 'ocean' | 'trees';
};

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

export type TCoordinates = { row: number; column: number };
