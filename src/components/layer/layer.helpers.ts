import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

import { Layer, LayerModel } from '.';
import { ApolloContext } from '$types/index';

export const getLayerLoader = (
  key,
  { dataloaders, state }: ApolloContext,
): DataLoader<string | ObjectId, Layer> => {
  let dl = dataloaders.get(key);

  if (!dl) {
    dl = new DataLoader(async (keys: readonly (string | ObjectId)[]) => {
      return await LayerModel.getAllowed(state?.decodedUser, { _id: { $in: keys } });
    }, { cacheKeyFn: key => key.toString() });

    dataloaders.set(key, dl);
  }

  return dl;
};
