import Koa from 'koa';
import Router from 'koa-router';
import socketIo from 'socket.io';
import { getEnv } from './env';
import { applyMiddleware } from './middleware';
import { Grid } from '../flow-core/grid';
import { DEFAULT_SQUARE_SIZE, Game } from '../flow-core/game';
import { terrainGenerator } from '../flow-core/terrain_generator';
import { CityModule } from '../flow-core/modules/city_module';
import {
  COMMANDS,
  PlayerRegistrationProps,
  GAME_EVENTS,
  ACTIONS,
  RoadProps,
} from '../common/types';
import { v4 as uuid } from 'uuid';
import { GameManager } from './game/game_manager';
import { interval } from 'kefir';

const app = new Koa();
const router = new Router();
const env = getEnv();

applyMiddleware(app);
app.use(router.routes());
app.use(router.allowedMethods());

router.post('/player', (ctx, next) => {
  const { name } = ctx.request.body;
  console.log(`Registering ${name}`);

  ctx.status = 200;
});

router.post('/test_grid', (ctx, next) => {
  const game = new Game();
  game.grid = new Grid(DEFAULT_SQUARE_SIZE, DEFAULT_SQUARE_SIZE);
  terrainGenerator(game.grid);

  const cities = CityModule.SeedCities(10, game);
  for (const city of cities) {
    game.addCity(city);
  }

  ctx.body = game.grid;
});

const http = app.listen(env.port, () => {
  console.log(`Listening on port ${env.port}`);
});

const io = socketIo.listen(http);

// Game
const gameManager = new GameManager(() => {
  // On Tick
  const tickId = gameManager.currentTickId;
  gameManager.game.tick();
  io.sockets.emit(GAME_EVENTS.TICK, tickId);
  update();
});

router.get('/play', (ctx) => {
  io.sockets.emit(COMMANDS.START_GAME);
  gameManager.start();
  update();
  ctx.status = 200;
});

const update = () => {
  // Grid & Routes
  io.sockets.emit(GAME_EVENTS.GRID, gameManager.game.grid);
  io.sockets.emit(GAME_EVENTS.ROUTES, gameManager.game.routes);
  io.sockets.emit(GAME_EVENTS.CITIES, gameManager.game.cities);

  // All transactions
  for (const player of gameManager.game.players) {
    const socketId = gameManager.playerIdToSocketIdMap[player.id];

    io.to(socketId).emit(GAME_EVENTS.PLAYER, player);
  }
};

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on('connection', (socket) => {
  console.log(`[Connected] ${socket.id}`);
  socket.on(COMMANDS.PLAYER_REGISTRATION, (data: PlayerRegistrationProps) => {
    const name = data.name;
    const playerId = uuid().split('-')[0];
    gameManager.addPlayer(name, playerId, socket.id);
    socket.emit(COMMANDS.PLAYER_ID, { playerId, socketId: socket.id });
  });

  socket.on(ACTIONS.ROAD, (data: RoadProps) => {
    const block = gameManager.game.grid.blocks[data.row][data.column] || {};
    block.belongsTo = { playerId: data.playerId };

    gameManager.game.grid.set(block, data.row, data.column);
    update();
  });

  socket.on('disconnect', () => {
    // ?
  });
});
