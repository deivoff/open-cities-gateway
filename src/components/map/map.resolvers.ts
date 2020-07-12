import { Arg, Authorized, Ctx, FieldResolver, ID, Info, Mutation, Query, Resolver, Root } from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import { ObjectId } from 'mongodb';
import { ApolloContext } from '$types/index';
import { getUserLoader } from '$components/user';
import { AccessType, getAccessCode, getDefaultAccessSettings } from '$components/access';
import { getLayerLoader } from '$components/layer';
import { getMapLoader, Map, MapInput, MapModel } from '.';

@Resolver(() => Map)
export class MapResolvers {
  @Query(() => Map, { nullable: true })
  async map(
    @Arg('mapId', () => ID) mapId: ObjectId,
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    const dl = getMapLoader(info.fieldNodes, context);
    return await dl.load(mapId);
  }

  @Query(() => [Map])
  async maps(
    @Arg('userId', () => ID) userId: ObjectId,
    @Ctx() { state }: ApolloContext
    ) {
    try {
      return await MapModel.getAllowed(state?.decodedUser)({ owner: userId });
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => Map)
  async createMap(
    @Arg('mapInput', () => MapInput) mapInput: MapInput,
    @Arg('type', () => AccessType, { nullable: true }) type: AccessType,
    @Ctx() { state }: ApolloContext,
  ) {
    const { decodedUser } = state;
    const map = new MapModel({
      ...mapInput,
      owner: decodedUser!.id,
      _access: getDefaultAccessSettings(type),
    });
    try {
      return await map.save();
    } catch (err) {
      throw err;
    }
  }

  @FieldResolver()
  access(
    @Root() { _access }: Map,
    @Ctx() context: ApolloContext,
  ) {
    return getAccessCode(_access, context.state?.decodedUser);
  }

  @FieldResolver()
  async owner(
    @Root() map: Map,
    @Ctx() context: ApolloContext,
    @Info() info,
    ) {
    const dl = getUserLoader(info.fieldNodes, context);
    return await dl.load(map.owner as ObjectId);
  }

  @FieldResolver()
  async layers(
    @Root() map: Map,
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    const dl = getLayerLoader(info.fieldNodes, context);
    return await dl.loadMany(map.layers as ObjectId[]);
  }
}
