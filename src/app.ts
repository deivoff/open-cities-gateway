import 'reflect-metadata';
import path from 'path';
import Koa from 'koa';
import KoaRouter from 'koa-router';
import logger from 'koa-logger';
import { ApolloServer } from 'apollo-server-koa';
import mongoose from 'mongoose';
import { buildSchema } from 'type-graphql';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
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
  const app = new Koa();
  const router = new KoaRouter();

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
      origin: '*',
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
    playground: true, // process.env.NODE_ENV === 'development',
    introspection: true,
  });
  app.use(router.routes());
  app.use(router.allowedMethods());

  server.applyMiddleware({ app, path: '/graphql' });

  try {
    const {
      'NODE_ENV': env,
      'DB_NAME': dbName,
      'DB_URL': dbUrl,
      'DB_PASS': pass,
      'DB_USER': user,
    } = process.env;

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
    console.log(error);
  }

  return app;
};

