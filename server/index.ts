import Koa from "koa";
import Router from "koa-router";
///@ts-ignore
import socketConstructor from "koa-socket-2";
import { Server } from "socket.io";
import fs from "fs";
import path from "path";
import send from "koa-send";

import { getEnv } from "./env";

const app = new Koa();
const router = new Router();
const socket: Server = new socketConstructor(80);
const env = getEnv();

socket.attach(app);

socket.on("connect", socket => {
  console.log(`Got a bite!`);
});

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

// Static file server:
app.use(async (ctx, next) => {
  if (ctx.path === "/") {
    await send(ctx, "/dist/index.html", {
      root: path.resolve(__dirname, "..")
    });
  }
  if (ctx.path.startsWith("/dist/")) {
    await send(ctx, ctx.path, { root: path.resolve(__dirname, "..") });
  }
  await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env.port, () => {
  console.log(`Listening on port ${env.port}`);
});
