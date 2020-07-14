import { Arg, Authorized, Ctx, FieldResolver, Info, Mutation, Query, Resolver, Root } from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import { ObjectId } from 'mongodb';
import { ApolloContext } from '$types/index';
import { getUserLoader } from '$components/user';
import { AccessType, getAccessCode, getDefaultAccessSettings } from '$components/access';
import { getLayerLoader } from '$components/layer';
import { getMapLoader, Map, MapInput, MapModel } from '.';
import { ObjectIdScalar } from '$helpers/scalars';

@Resolver(() => Map)
export class MapResolvers {
  @Query(() => Map, { nullable: true })
  async map(
    @Arg('mapId', () => ObjectIdScalar) mapId: ObjectId,
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    const dl = getMapLoader(info.fieldNodes, context);
    return await dl.load(mapId);
  }

  @Query(() => [Map])
  async maps(
    @Arg('userId', () => ObjectIdScalar) userId: ObjectId,
    @Ctx() { state }: ApolloContext,
  ) {
    try {
      const maps = await MapModel.getAllowed(
        state?.decodedUser,
        { owner: userId },
      );
      return maps.filter(map => map);
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => Map)
  async createMap(
    @Arg(
      'mapInput', () => MapInput,
    ) mapInput: MapInput,
    @Arg(
      'type', () => AccessType,
      { nullable: true },
    ) type: AccessType,
    @Ctx() { state }: ApolloContext,
  ): Promise<Map> {
    const { decodedUser } = state;
    const map = new MapModel({
      ...mapInput,
      owner: decodedUser!.id,
      _access: getDefaultAccessSettings(type),
    });
    try {
      const savedMap = await map.save();
      return savedMap.toObject();
    } catch (err) {
      throw err;
    }
  }

  @FieldResolver()
  access(
    @Root() { _access, owner }: Map,
    @Ctx() context: ApolloContext,
  ) {
    return getAccessCode({
      access: _access,
      owner: owner as ObjectId,
    }, context.state?.decodedUser);
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
    const layers = await dl.loadMany(map.layers as ObjectId[]);
    return layers.filter(layer => layer);
  }
}
