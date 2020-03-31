import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Map, MapModel } from '.';
import { userLoader } from '$components/user';
import { Context } from '$types/index';
import { checkAuth } from '$middleware/auth';
import { MapInput } from '$components/map/map.inputs';
import { AccessType, getDefaultAccessSettings } from '$components/access';
import { ObjectId } from 'mongodb';
import { layerLoader } from '$components/layer';

@Resolver(() => Map)
export class MapResolvers {
  @Query(() => Map, { nullable: true })
  async map(
    @Arg('id') id: string
  ): Promise<Map | null> {
    try {
      return await MapModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [Map])
  async maps(@Arg('userId') userId: string): Promise<Map[]> {
    try {
      return await MapModel.find({ owner: userId });
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Map)
  async createMap(
    @Arg('mapInput', () => MapInput) mapInput: MapInput,
    @Arg('type', ()=> AccessType, { nullable: true }) type: AccessType,
    @Ctx() { ctx }: { ctx: Context },
  ): Promise<Map> {
    checkAuth(ctx);
    const { decodedUser } = ctx.state;
    const map = new MapModel({
      ...mapInput,
      owner: decodedUser!.id,
      access: getDefaultAccessSettings(type),
    });
    try {
      return await map.save();
    } catch (err) {
      throw err;
    }
  }

  @FieldResolver()
  async owner(@Root() { owner }: MapModel) {
    return await userLoader.load(owner as ObjectId);
  }

  @FieldResolver()
  async layers(@Root() { layers}: MapModel) {
    return await layerLoader.loadMany(layers as ObjectId[]);
  }
}
