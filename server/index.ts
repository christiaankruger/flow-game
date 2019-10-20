import Koa from 'koa';
import Router from 'koa-router';
///@ts-ignore
import socketConstructor from 'koa-socket-2';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import send from 'koa-send';

import { getEnv } from './env';
import { applyMiddleware } from './middleware';
import { Grid } from '../flow-core/grid';
import { DEFAULT_SQUARE_SIZE } from '../flow-core/game';

const app = new Koa();
const router = new Router();
const socket: Server = new socketConstructor(80);
const env = getEnv();

socket.attach(app);

socket.on('connect', socket => {
  console.log(`Got a bite!`);
});

applyMiddleware(app);
app.use(router.routes());
app.use(router.allowedMethods());

router.post('/player', (ctx, next) => {
  const { name } = ctx.request.body;
  console.log(`Registering ${name}`);

  ctx.status = 200;
});

router.post('/test_grid', (ctx, next) => {
  const grid = new Grid(DEFAULT_SQUARE_SIZE, DEFAULT_SQUARE_SIZE);
  ctx.body = grid;
});

app.listen(env.port, () => {
  console.log(`Listening on port ${env.port}`);
});
