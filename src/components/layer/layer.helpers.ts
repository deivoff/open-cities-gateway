import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

import { LayerModel } from '.';

export const layerLoader = new DataLoader(
  async (keys: readonly (string | ObjectId)[]) => {
    const stringKeys = keys.map(key => key.toString());
    return LayerModel.find({ _id: { $in: stringKeys } });
  },
  {cacheKeyFn: key => key.toString()}
);
