import {
  prop as Property, Ref, arrayProp as Properties, getModelForClass, modelOptions, ReturnModelType, DocumentType,
} from '@typegoose/typegoose';
import { ID, Field, Int, ObjectType, InputType } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { User } from '../user';
import { Access, ACCESS_CODE, getAccessCode } from '$components/access';
import { GeometryCoords, Position } from '$components/geo';
import { Layer } from '$components/layer';
import { DecodedToken } from '$components/auth';

@ObjectType()
@InputType('MapSettingInput')
export class MapSettings {

  @Field(() => GeometryCoords)
  @Properties({ required: true, items: Array })
  bbox!: Position[];

  @Field(() => Int)
  @Property({ required: true })
  zoom!: number;

}

@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true} })
export class Map {

  @Field(() => ID)
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
  @Properties({ ref: Layer })
  layers?: Ref<Layer>[];

  @Field(() => Boolean)
  @Property()
  draft?: boolean;

  static getAllowed = (
    user?: DecodedToken
  ) => async (
    ...parameters: Parameters<DocumentType<MapModel>['find']>
  ) => {
    const maps = await MapModel.find(...parameters);
    return maps.reduce((acc, layer) => {
      let { _access } = layer;
      const accessCode = getAccessCode(_access, user);

      if (accessCode) {
        layer.access = accessCode;
        acc.push(layer);
      }

      return acc;
    }, [] as Map[]);
  }
}

export type MapModel = ReturnModelType<typeof Map>;
export const MapModel: MapModel = getModelForClass(Map);
