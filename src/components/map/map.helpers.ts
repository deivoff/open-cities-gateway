import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

import { MapModel } from '.';

export const mapLoader = new DataLoader(
  async (keys: readonly (string | ObjectId)[]) => {
    const stringKeys = keys.map(key => key.toString());
    return MapModel.find({ _id: { $in: stringKeys } });
  },
  {cacheKeyFn: key => key.toString()}
);
