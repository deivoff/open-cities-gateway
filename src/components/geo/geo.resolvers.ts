import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Geo, GeoDocument, GeoInput, GeoModel } from '.';
import { User, UserModel } from '../user';
import { Layer, LayerModel } from '../layer';
import { Context } from '$types/index';
import { checkAuth } from '$middleware/auth';

@Resolver(of => Geo)
export class GeoResolvers {

  @Query(returns => [Geo])
  async geos(
    @Arg('layerId', () => ID) layerId: Layer,
    @Ctx() { ctx }: { ctx: Context }
  ): Promise<Geo[]> {
    checkAuth(ctx);
    const { decodedUser } = ctx.state;
    try {
      return await GeoModel.find({
        layer: layerId,
        access: decodedUser!.access
      });
    } catch (error) {
      throw error;
    }
  }

  @Mutation(returns => Geo)
  async createGeo(
    @Arg('geoInput', type => GeoInput) { properties, geometry, layer }: GeoInput,
      @Ctx() { ctx }: { ctx: Context },
  ): Promise<Geo> {
    checkAuth(ctx);
    const { decodedUser } = ctx.state;
    const geo = new GeoModel({
      properties,
      geometry,
      layer,
      author: decodedUser!.id,
      access: decodedUser!.access,
    });
    try {
      return await geo.save();
    } catch (err) {
      throw err;
    }
  }

  @FieldResolver(() => User)
  async author(@Root() geo: GeoDocument): Promise<User> {
    try {
      const { author } = geo;
      return (await UserModel.findById(author))!;
    } catch (error) {
      throw error;
    }
  }

  @FieldResolver(() => Layer)
  async layer(@Root() geo: GeoDocument): Promise<Layer> {
    try {
      const { layer } = geo;
      console.log(layer);
      return (await LayerModel.findById(layer))!;
    } catch (error) {
      throw error;
    }
  }

}
