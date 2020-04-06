import { Arg, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Layer, LayerInput, LayerModel } from '.';
import { userLoader, UserType } from '../user';
import { Context } from '$types/index';
import { ObjectId } from 'mongodb';
import { MapModel } from '$components/map/map.entity';
import { getDefaultAccessSettings } from '$components/access';

@Resolver(() => Layer)
export class LayerResolvers {

  @Authorized()
  @Query(() => [Layer])
  async layers(@Arg('mapId') mapId: string, @Ctx() { ctx }: { ctx: Context }): Promise<Layer[]> {
    try {
      const { decodedUser } = ctx.state;
      if (decodedUser) {
        return await LayerModel.find();
      }
      return (await LayerModel.find())!;
    } catch (error) {
      throw error;
    }
  }

  @Authorized([UserType.researcher])
  @Mutation(() => Layer)
  async createLayer(
    @Arg('layerInput', () => LayerInput) layerInput: LayerInput,
      @Arg('mapId', () => ID) mapId: string,
      @Ctx() { ctx }: { ctx: Context },
  ): Promise<Layer> {
    const { decodedUser } = ctx.state;

    const layer = new LayerModel({
      ...layerInput,
      owner: decodedUser!.id,
      access: getDefaultAccessSettings(),
    });
    try {
      const savedLayer = await layer.save();
      await MapModel.findByIdAndUpdate(mapId, { $push: { layers: savedLayer._id } });
      return savedLayer;
    } catch (err) {
      throw err;
    }
  }

  @FieldResolver()
  async owner(@Root() { owner }: LayerModel) {
    return await userLoader.load(owner as ObjectId);
  }

}
