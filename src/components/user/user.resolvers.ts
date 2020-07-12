import { Resolver, Query } from 'type-graphql';

import { User } from '.';
import { UserModel } from './user.entity';

@Resolver(() => User)
export class UserResolvers {

  @Query(() => [User])
  async users() {
    try {
      return await UserModel.find();
    } catch (error) {
      throw error;
    }
  }

}
