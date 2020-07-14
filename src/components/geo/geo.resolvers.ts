import { Arg, Authorized, Ctx, FieldResolver, Info, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Geo, GeoInput, GeoModel } from '.';
import { getUserLoader, User } from '../user';
import { getLayerLoader, Layer } from '../layer';
import { ApolloContext } from '$types/index';
import { ObjectId } from 'mongodb';
import { GraphQLResolveInfo } from 'graphql';
import { ObjectIdScalar } from '$helpers/scalars';

@Resolver(() => Geo)
export class GeoResolvers {

  @Query(() => [Geo])
  async geos(
    @Arg('layerId', () => ObjectIdScalar) layerId: Layer,
  ): Promise<Geo[]> {
    try {
      return await GeoModel.find({
        layer: layerId,
      });
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => Geo)
  async createGeo(
    @Arg('geoInput', () => GeoInput) geoInput: GeoInput,
      @Ctx() { state }: ApolloContext,
  ) {
    const { decodedUser } = state;
    const geo = new GeoModel({
      ...geoInput,
      owner: decodedUser!.id,
    });
    try {
      return await geo.save();
    } catch (err) {
      throw err;
    }
  }

  @Authorized()
  @Mutation(() => [Geo])
  async createGeos(
    @Arg('geoInput', () => [GeoInput]) geos: GeoInput[],
    @Ctx() { state }: ApolloContext,
  ): Promise<Geo[]> {
    try {
      const geosWithOwner = geos.map(geo => ({
        ...geo,
        owner: state.decodedUser?.id
      }));
      return await GeoModel.insertMany(geosWithOwner);
    } catch (err) {
      throw err;
    }
  }

  @FieldResolver(() => User)
  async owner(
    @Root() { owner }: Geo,
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    const dl = getUserLoader(info.fieldNodes, context);
    try {
      return await dl.load(owner as ObjectId);
    } catch (e) {
      throw e;
    }
  }

  @FieldResolver(() => Layer)
  async layer(
    @Root() { layer}: Geo,
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    const dl = getLayerLoader(info.fieldNodes, context);
    try {
      return await dl.load(layer as ObjectId);
    } catch (error) {
      throw error;
    }
  }

}
