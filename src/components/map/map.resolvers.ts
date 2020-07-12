import {
  Arg, Authorized,
  Ctx, FieldResolver, ID,
  Info, Mutation,
  Query, Resolver, Root
} from 'type-graphql';
import { GraphQLResolveInfo } from 'graphql';
import { ObjectId } from 'mongodb';
import { ApolloContext } from '$types/index';
import { getUserLoader } from '$components/user';
import { AccessType, getDefaultAccessSettings } from '$components/access';
import { getLayerLoader } from '$components/layer';
import { Map, MapModel, MapInput, getMapLoader } from '.';

@Resolver(() => Map)
export class MapResolvers {
  @Query(() => Map, { nullable: true })
  async map(
    @Arg('id') id: ObjectId,
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    const dl = getMapLoader(info.fieldNodes, context);
    return await dl.load(id);
  }

  @Query(() => [Map])
  async maps(
    @Arg('userId', () => ID) userId: string,
    @Ctx() { state }: ApolloContext
    ): Promise<Map[]> {
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
    @Arg('type', ()=> AccessType, { nullable: true }) type: AccessType,
    @Ctx() { state }: ApolloContext,
  ): Promise<Map> {
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
  async owner(
    @Root() { owner }: MapModel,
    @Ctx() context: ApolloContext,
    @Info() info,
    ) {
    const dl = getUserLoader(info.fieldNodes, context);
    return await dl.load(owner as ObjectId);
  }

  @FieldResolver()
  async layers(
    @Root() { layers}: MapModel,
    @Ctx() context: ApolloContext,
    @Info() info: GraphQLResolveInfo,
  ) {
    const dl = getLayerLoader(info.fieldNodes, context);
    return await dl.loadMany(layers as ObjectId[]);
  }
}
