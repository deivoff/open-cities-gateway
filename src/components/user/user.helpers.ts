import DataLoader from 'dataloader';
import { ObjectId } from 'mongodb';

import { UserModel } from '.';

export const userLoader = new DataLoader(
  async (keys: readonly (string | ObjectId)[]) => {
    const stringKeys = keys.map(key => key.toString());
    return UserModel.find({ _id: { $in: stringKeys } });
  },
  {cacheKeyFn: key => key.toString()}
);
