import Koa from 'koa';
import { DecodedToken } from '$components/auth';
import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

type ContextState = {
  isAuth?: boolean;
  decodedUser?: DecodedToken;
};

export type Context = Koa.ParameterizedContext<ContextState, {}>;
export type ApolloContext = Pick<Context, 'state' | 'request'> & {
  dataloaders: WeakMap<any, DataLoader<string | ObjectId, any, any>>;
}
