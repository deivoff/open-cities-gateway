import { Resolver, Query, Arg, FieldResolver, Root, Ctx, Info } from 'type-graphql';
import { City, CityModel } from '.';
import { ObjectId } from 'mongodb';
import { getMapLoader } from '$components/map';
import { ApolloContext } from '$types/index';
import { GraphQLResolveInfo } from 'graphql';

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
  async map(
    @Root() { map }: CityModel,
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    const dl = getMapLoader(info.fieldNodes, context);
    return await dl.load(map as ObjectId);
  }
}
