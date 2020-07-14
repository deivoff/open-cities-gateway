import { DocumentType, getModelForClass, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Field, InputType, Int, Maybe, ObjectType } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { User } from '../user';
import { Access, ACCESS_CODE, checkAccess } from '$components/access';
import { GeometryCoords, Position } from '$components/geo';
import { Layer } from '$components/layer';
import { DecodedToken } from '$components/auth';
import { ObjectIdScalar } from '$helpers/scalars';

@ObjectType()
@InputType('MapSettingInput')
export class MapSettings {

  @Field(() => GeometryCoords)
  @Property({ required: true, items: Array })
  bbox!: Position[];

  @Field(() => Int)
  @Property({ required: true })
  zoom!: number;

}

@ObjectType()
export class Map {

  @Field(() => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field(() => Date)
  readonly createdAt!: Date;

  @Field(() => Date)
  readonly updatedAt!: Date;

  @Field(() => User)
  @Property({ required: true, ref: User })
  owner!: Ref<User>;

  @Field()
  @Property({ required: true })
  name!: string;

  @Field()
  @Property()
  description?: string;

  @Property({ required: true, _id: false })
  _access!: Access;

  @Field(() => ACCESS_CODE)
  access?: ACCESS_CODE;

  @Field(() => MapSettings)
  @Property({ required: true, _id: false })
  settings!: MapSettings;

  @Field(() => [Layer])
  @Property({ required: true, ref: Layer, type: () => [Layer] })
  layers?: Ref<Layer>[];

  @Field(() => Boolean)
  @Property()
  draft?: boolean;

  static async getAllowed(
    user?: DecodedToken,
    ...parameters: Parameters<DocumentType<MapModel>['find']> | any
  ) {
    const maps = await MapModel.find(...parameters);
    return maps.reduce((acc, map) => {
      const { _access, owner } = map;
      const accessExist = checkAccess({
        access: _access,
        owner: owner as ObjectId,
      }, user);

      if (accessExist) {
        acc.push(map);
      } else {
        acc.push(null);
      }

      return acc;
    }, [] as Maybe<Map>[]);
  }
}

export type MapModel = ReturnModelType<typeof Map>;
export const MapModel: MapModel = getModelForClass(Map, { schemaOptions: { timestamps: true} });
