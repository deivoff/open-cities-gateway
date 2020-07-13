import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

import { LayerModel } from '.';
import { ApolloContext } from '$types/index';

export const getLayerLoader = (
  key,
  { dataloaders, state}: ApolloContext
): DataLoader<string | ObjectId, LayerModel> => {
  let dl = dataloaders.get(key);

  if (!dl) {
    dl = new DataLoader(async (keys: readonly (string | ObjectId)[]) => {
      const stringKeys = keys.map(key => key.toString());


      return LayerModel.getAllowed(state?.decodedUser, { _id: { $in: stringKeys } });
    }, { cacheKeyFn: key => key.toString() });

    dataloaders.set(key, dl);
  }

  return dl;
};
