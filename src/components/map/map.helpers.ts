import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

import { MapModel } from '.';
import { ApolloContext } from '$types/index';

export const getMapLoader = (key, { dataloaders, state}: ApolloContext) => {
  let dl = dataloaders.get(key);

  if (!dl) {
    dl = new DataLoader(async (keys: readonly (string | ObjectId)[]) => {
      const stringKeys = keys.map(key => key.toString());


      return MapModel.getAllowed(state?.decodedUser)({ _id: { $in: stringKeys } });
    }, { cacheKeyFn: key => key.toString() });

    dataloaders.set(key, dl);
  }

  return dl;
};
