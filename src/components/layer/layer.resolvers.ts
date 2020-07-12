import { Arg, Authorized, Ctx, FieldResolver, ID, Info, Mutation, Query, Resolver, Root } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { GraphQLResolveInfo } from 'graphql';
import { ApolloContext } from '$types/index';
import { getUserLoader, USER_ROLE } from '$components/user';
import { MapModel } from '$components/map';
import { getAccessCode, getDefaultAccessSettings } from '$components/access';
import { Layer, LayerInput, LayerModel } from '.';

@Resolver(() => Layer)
export class LayerResolvers {

  @Query(() => [Layer])
  async layers(
    @Arg('mapId', () => ID) mapId: string,
    @Ctx() { state }: ApolloContext
  ) {
    try {
      // @ts-ignore
      return await LayerModel.getAllowed(state?.decodedUser)();
    } catch (error) {
      throw error;
    }
  }

  @Authorized([USER_ROLE.RESEARCHER])
  @Mutation(() => Layer)
  async createLayer(
    @Arg('layerInput', () => LayerInput) layerInput: LayerInput,
    @Arg('mapId', () => ID) mapId: string,
    @Ctx() { state }: ApolloContext,
  ) {
    const { decodedUser } = state;

    const layer = new LayerModel({
      ...layerInput,
      owner: decodedUser!.id,
      _access: getDefaultAccessSettings(),
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
  access(
    @Root() { _access }: Layer,
    @Ctx() context: ApolloContext,
  ) {
    return getAccessCode(_access, context.state?.decodedUser);
  }

  @FieldResolver()
  async owner(
    @Root() { owner }: Layer,
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    const dl = getUserLoader(info.fieldNodes, context);
    return await dl.load(owner as ObjectId);
  }

}
