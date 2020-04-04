import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Geo, GeoInput, GeoModel } from '.';
import { User, UserModel } from '../user';
import { Layer, LayerModel } from '../layer';
import { Context } from '$types/index';
import { checkAuth } from '$middleware/auth';

@Resolver(() => Geo)
export class GeoResolvers {

  @Query(() => [Geo])
  async geos(
    @Arg('layerId', () => ID) layerId: Layer,
    @Ctx() { ctx }: { ctx: Context }
  ): Promise<Geo[]> {
    checkAuth(ctx);
    try {
      return await GeoModel.find({
        layer: layerId,
      });
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Geo)
  async createGeo(
    @Arg('geoInput', () => GeoInput) geoInput: GeoInput,
      @Ctx() { ctx }: { ctx: Context },
  ): Promise<Geo> {
    checkAuth(ctx);
    const { decodedUser } = ctx.state;
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

  @Mutation(() => [Geo])
  async createGeos(
    @Arg('geoInput', () => [GeoInput]) geos: GeoInput[],
    @Ctx() { ctx }: { ctx: Context },
  ): Promise<Geo[]> {
    checkAuth(ctx);
    try {
      const geosWithOwner = geos.map(geo => ({
        ...geo,
        owner: ctx.state.decodedUser?.id
      }));
      return await GeoModel.insertMany(geosWithOwner);
    } catch (err) {
      throw err;
    }
  }

  @FieldResolver(() => User)
  async author(@Root() geo: Geo): Promise<User> {
    try {
      const { owner } = geo;
      return (await UserModel.findById(owner))!;
    } catch (error) {
      throw error;
    }
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
