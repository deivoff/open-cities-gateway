import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

import { Map, MapModel } from '.';
import { ApolloContext } from '$types/index';

export const getMapLoader = (
  key,
  { dataloaders, state}: ApolloContext
): DataLoader<string | ObjectId, Map> => {
  let dl = dataloaders.get(key);

  if (!dl) {
    dl = new DataLoader(async (keys: readonly (string | ObjectId)[]) => {
      return await MapModel.getAllowed(state?.decodedUser, { _id: { $in: keys } });
    }, { cacheKeyFn: key => key.toString() });

    dataloaders.set(key, dl);
  }

  return dl;
};
