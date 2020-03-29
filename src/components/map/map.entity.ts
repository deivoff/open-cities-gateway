import {
  prop as Property, Ref, arrayProp as Properties, getModelForClass, modelOptions, ReturnModelType,
} from '@typegoose/typegoose';
import { ID, Field, Int, ObjectType, InputType } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { User } from '../user';
import { Access } from '$components/access';
import { GeometryCoords, Position } from '$components/geo';
import { Layer } from '$components/layer';

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

  @Field(() => Access)
  @Property({ required: true, _id: false })
  access!: Access;

  @Field(() => MapSettings)
  @Property({ required: true, _id: false })
  settings!: MapSettings;

  @Field(() => [Layer])
  @Properties({ ref: Layer })
  layers?: Ref<Layer>[];

  @Field(() => Boolean)
  @Property()
  draft?: boolean;

}

export type MapModel = ReturnModelType<typeof Map>;
export const MapModel: MapModel = getModelForClass(Map);
