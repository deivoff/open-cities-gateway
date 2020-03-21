import { Resolver, Query, Arg } from 'type-graphql';
import { City, CityModel } from '.';

@Resolver(() => City)
export class CityResolvers {

  @Query(() => [City])
  async cities(): Promise<City[]> {
    try {
      return await CityModel.find();
    } catch (error) {
      throw error;
    }
  }

  @Query(() => City, { nullable: true })
  async getCity(
    @Arg('url') url: string
  ): Promise<City | null> {
    try {
      return await CityModel.findOne({ url });
    } catch (error) {
      throw error;
    }
  }

}
