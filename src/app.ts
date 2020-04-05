import 'reflect-metadata';
import path from 'path';
import logger from 'koa-logger';
import mongoose from 'mongoose';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import * as Sentry from '@sentry/node';
import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';
import { UserResolvers } from '$components/user';
import { CityResolvers } from '$components/city';
import { GeoResolvers } from '$components/geo';
import { LayerResolvers } from '$components/layer';
import { AuthResolvers } from '$components/auth';
import { MapResolvers } from '$components/map';

import { oauthHandler } from '$helpers/oauth';
import { isAuth } from '$middleware/auth';
import { Context } from '$types/index';

process.env.NODE_ENV === 'development' && require('dotenv').config({ path: path.join(`${__dirname}./../.env`) });

export const createApp = async () => {
  const {
    'NODE_ENV': env,
    'DB_NAME': dbName,
    'DB_URL': dbUrl,
    'DB_PASS': pass,
    'DB_USER': user,
    'ORIGIN_URL': originUrl,
  } = process.env;

  const app = new Koa();
  const router = new KoaRouter();

  Sentry.init({ dsn: 'https://c081181293934a2a95348d7e06593bff@sentry.io/5189252' });
  app.on('error', (err, ctx) => {
    Sentry.withScope((scope) => {
      scope.addEventProcessor((event) => {
        return Sentry.Handlers.parseRequest(event, ctx.request);
      });
      Sentry.captureException(err);
    });
  });

  // OAUTH
  router.get('/oauth/*', oauthHandler);

  const schema = await buildSchema({
    resolvers: [
      UserResolvers,
      CityResolvers,
      GeoResolvers,
      LayerResolvers,
      AuthResolvers,
      MapResolvers
    ],
    emitSchemaFile: true,
    validate: false,
  });

  //

  app.use(
    cors({
      origin: originUrl,
      credentials: true,
    }),
  );
  app.use(bodyParser());
  app.use(async (ctx, next) => {
    ctx.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, X-Requested-With, x-access-token',
    );
    ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');

    if (ctx.method === 'OPTIONS') {
      return (ctx.status = 200);
    }

    await next();
  });
  app.use(logger());
  app.use(isAuth);

  const server = new ApolloServer({
    schema,
    context: (ctx: Context) => ctx,
    playground: env === 'development',
    introspection: true,
  });
  app.use(router.routes());
  app.use(router.allowedMethods());

  server.applyMiddleware({ app, path: '/graphql' });

  try {
    await mongoose.connect(`${dbUrl}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName,
      user,
      pass,
    });
    env === ('development' || 'test') && mongoose.set('debug', true);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error);
  }

  return app;
};

