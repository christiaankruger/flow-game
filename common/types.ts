export const COMMANDS = {
  PLAYER_REGISTRATION: 'player-registration',
  PLAYER_ID: 'player-id',
  START_GAME: 'start-game',
  DEBUG: 'debug'
};

export const GAME_EVENTS = {
  GRID: 'grid',
  ROUTES: 'routes',
  PLAYER: 'player',
  CITIES: 'cities',
  TICK: 'tick'
};

export const ACTIONS = {
  ROAD: 'road'
};

export type RoadProps = {
  column: number;
  row: number;
  playerId: string;
  tickId: string;
};

export type PlayerRegistrationProps = {
  name: string;
};
export type PlayerIDProps = {
  playerId: string;
  socketId: string;
};
