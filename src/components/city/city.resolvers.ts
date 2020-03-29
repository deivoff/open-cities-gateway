import { Resolver, Query, Arg, FieldResolver, Root } from 'type-graphql';
import { City, CityModel } from '.';
import { ObjectId } from 'mongodb';
import { mapLoader } from '$components/map';

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
  async city(
    @Arg('url') url: string
  ): Promise<City | null> {
    try {
      return await CityModel.findOne({ url });
    } catch (error) {
      throw error;
    }
  }

  @FieldResolver()
  async map(@Root() { map }: CityModel) {
    return await mapLoader.load(map as ObjectId);
  }
}
