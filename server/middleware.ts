import compose = require('koa-compose');
import Koa from 'koa';
import send from 'koa-send';
import path from 'path';
import bodyParser from 'koa-bodyparser';

type MiddlewareType = compose.Middleware<
  Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>
>;

export const applyMiddleware = (app: Koa<any, any>): void => {
  for (let middleware of OrderedMiddleware) {
    app.use(middleware);
  }
};

const OrderedMiddleware: MiddlewareType[] = [
  // Setup bodyparser
  bodyParser(),
  // Logger
  async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
  },
  // Measure Response Time
  async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
  },
  // Static file server
  async (ctx, next) => {
    if (ctx.path === '/') {
      await send(ctx, '/index.html', {
        root: path.resolve(__dirname, '..', 'dist')
      });
    }

    if (ctx.path === '/test') {
      await send(ctx, '/index_test.html', {
        root: path.resolve(__dirname, '..', 'dist')
      });
    }

    // KLUDGE: + because sometimes a dist/dist sneaks in. FIXME PLEASE
    // DOUBLE KLUDGE: Seems to be inconsistent?
    const distCheckerRegex = /^(\/?dist\/)+/;
    if (distCheckerRegex.test(ctx.path)) {
      const relativePath = ctx.path.replace(distCheckerRegex, '');
      await send(ctx, relativePath, {
        root: path.resolve(__dirname, '..', 'dist')
      });
    }
    await next();
  }
];
