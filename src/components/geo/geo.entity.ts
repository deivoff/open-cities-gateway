import {
  ObjectType, ID, Field, InputType, Float, Int
} from 'type-graphql';
import { ObjectId } from 'mongodb';
import { GeoJsonProperties } from 'geojson';
import { User } from '../user';
import { GeometryType, GeometryCoords, Position } from '.';
import { GraphQLJSON } from '$helpers/scalars';
import { Layer } from '../layer';
import {
  modelOptions,
  prop as Property,
  Ref,
  arrayProp as Properties,
  getModelForClass,
  ReturnModelType,
} from '@typegoose/typegoose';

@ObjectType()
@InputType('GeometryInput')
export class Geometry {

  @Field(() => GeometryType)
  @Property({ required: true, enum: GeometryType })
  type!: GeometryType;

  @Field(() => GeometryCoords)
  @Properties({ items: Number })
  coordinates!: Position | Position[] | Position[][] | Position[][][];
}

@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true} })
export class Geo {

  @Field(() => ID)
  readonly _id!: ObjectId;

  @Field(() => Date)
  readonly createdAt!: Date;

  @Field(() => Date)
  readonly updatedAt!: Date;

  @Field(() => User)
  @Property({ required: true, ref: User })
  owner!: Ref<User>;

  @Field(() => Layer)
  @Property({ required: true, ref: Layer })
  layer!: Ref<Layer>;

  @Field(() => Geometry)
  @Property({ required: true, _id: false })
  geometry!: Geometry;

  @Field(() => GraphQLJSON)
  @Property()
  properties?: GeoJsonProperties;

}

export class GeoSum extends Geo {

  @Field(() => Float)
  sum!: number;

  @Field(() => Int)
  geoObjects!: number;

}

export type GeoModel = ReturnModelType<typeof Geo>;
export const GeoModel: GeoModel = getModelForClass(Geo);
