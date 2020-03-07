import { Resolver, Query } from 'type-graphql';

import { User } from '.';
import { UserModel } from './user.entity';

@Resolver(of => User)
export class UserResolvers {

  @Query(returns => [User])
  async getUsers(): Promise<User[]> {
    try {
      return await UserModel.find();
    } catch (error) {
      throw error;
    }
  }

}
