import { Game, createGameWithSeeds } from '../../flow-core/game';
import { Player } from '../../flow-core/player';
import uuid = require('uuid');
import { TICK_DURATION } from '../../common/constants';

export class GameManager {
  playerIdToSocketIdMap: { [key: string]: string } = {};
  interval?: NodeJS.Timeout;
  onTick: () => void;
  currentTickId: string = '';

  constructor(onTick: () => void, public game: Game = createGameWithSeeds()) {
    this.onTick = onTick;
  }

  addPlayer(name: string, playerId: string, socketId: string) {
    this.game.addPlayer(
      new Player({
        name,
        id: playerId
      })
    );
    this.playerIdToSocketIdMap[playerId] = socketId;

    console.log(`${name} has joined the game.`);
  }

  start() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    // Tick 0
    this.tick();
    this.interval = setInterval(() => {
      this.tick();
    }, TICK_DURATION * 1000);
  }

  private tick() {
    this.currentTickId = uuid();
    console.log(`[TICK] ${this.currentTickId}`);
    this.onTick();
  }
}
