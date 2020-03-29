import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql';
import { Layer, LayerInput, LayerModel } from '.';
import { userLoader } from '../user';
import { Context } from '$types/index';
import { checkAuth } from '$middleware/auth';
import { ObjectId } from 'mongodb';

@Resolver(() => Layer)
export class LayerResolvers {

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

  @Mutation(() => Layer)
  async createLayer(
    @Arg('layerInput', () => LayerInput) layerInput: LayerInput,
      @Ctx() { ctx }: { ctx: Context },
  ): Promise<Layer> {
    checkAuth(ctx);
    const { decodedUser } = ctx.state;
    const layer = new LayerModel({
      ...layerInput,
      owner: decodedUser!.id,
      access: decodedUser!.access,
    });
    try {
      return await layer.save();
    } catch (err) {
      throw err;
    }
  }

  @FieldResolver()
  async owner(@Root() { owner }: LayerModel) {
    return await userLoader.load(owner as ObjectId);
  }

}
