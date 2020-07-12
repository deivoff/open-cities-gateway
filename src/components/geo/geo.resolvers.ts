import { Arg, Authorized, Ctx, FieldResolver, ID, Info, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Geo, GeoInput, GeoModel } from '.';
import { getUserLoader, User } from '../user';
import { Layer, LayerModel } from '../layer';
import { ApolloContext } from '$types/index';
import { ObjectId } from 'mongodb';

@Resolver(() => Geo)
export class GeoResolvers {

  @Query(() => [Geo])
  async geos(
    @Arg('layerId', () => ID) layerId: Layer
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
  ): Promise<Geo> {
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
    @Root() { owner }: GeoModel,
    @Ctx() context: ApolloContext,
    @Info() info,
  ) {
    const dl = getUserLoader(info.fieldNodes, context);
    return await dl.load(owner as ObjectId);
  }

  @FieldResolver(() => Layer)
  async layer(@Root() geo: Geo): Promise<Layer> {
    try {
      const { layer } = geo;
      return (await LayerModel.findById(layer))!;
    } catch (error) {
      throw error;
    }
  }

}
