import { Arg, Authorized, Ctx, FieldResolver, Info, Mutation, Query, Resolver, Root } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { GraphQLResolveInfo } from 'graphql';
import { ApolloContext } from '$types/index';
import { getUserLoader, USER_ROLE } from '$components/user';
import { MapModel } from '$components/map';
import { getAccessCode, getDefaultAccessSettings } from '$components/access';
import { ObjectIdScalar } from '$helpers/scalars';
import { getLayerLoader, Layer, LayerInput, LayerModel } from '.';


@Resolver(() => Layer)
export class LayerResolvers {
  @Query(() => Layer, { nullable: true })
  async layer(
    @Arg('layerId', () => ObjectIdScalar) layerId: ObjectId,
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    const dl = getLayerLoader(info.fieldNodes, context);
    return await dl.load(layerId);
  }

  @Query(() => [Layer])
  async layers(
    @Arg('mapId', () => ObjectIdScalar) mapId: string,
    @Ctx() { state }: ApolloContext,
  ) {
    try {
      const layers = await LayerModel.getAllowed(state?.decodedUser);
      return layers.filter(layer => layer);
    } catch (error) {
      throw error;
    }
  }

  @Authorized([USER_ROLE.RESEARCHER])
  @Mutation(() => Layer)
  async createLayerForMap(
    @Arg('layerInput', () => LayerInput) layerInput: LayerInput,
    @Arg('mapId', () => ObjectIdScalar) mapId: string,
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

  @Authorized([USER_ROLE.RESEARCHER])
  @Mutation(() => Layer)
  async createLayer(
    @Arg('layerInput', () => LayerInput) layerInput: LayerInput,
    @Ctx() { state }: ApolloContext,
  ) {
    const { decodedUser } = state;

    const layer = new LayerModel({
      ...layerInput,
      owner: decodedUser!.id,
      _access: getDefaultAccessSettings(),
    });
    try {
      return await layer.save();
    } catch (err) {
      throw err;
    }
  }

  @FieldResolver()
  access(
    @Root() { _access, owner }: Layer,
    @Ctx() context: ApolloContext,
  ) {
    return getAccessCode({
      access: _access,
      owner: owner as ObjectId,
    }, context.state?.decodedUser);
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
