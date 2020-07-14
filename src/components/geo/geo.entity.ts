import { Field, Float, InputType, Int, ObjectType } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { GeoJsonProperties } from 'geojson';
import { User } from '../user';
import { GeometryCoords, GeometryType, Position } from '.';
import { GraphQLJSON, ObjectIdScalar } from '$helpers/scalars';
import { Layer } from '../layer';
import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop as Property,
  Ref,
  ReturnModelType,
  Severity,
} from '@typegoose/typegoose';

@ObjectType()
@InputType('GeometryInput')
export class Geometry {

  @Field(() => GeometryType)
  @Property({ required: true, enum: GeometryType })
  type!: GeometryType;

  @Field(() => GeometryCoords)
  @Property({ type: mongoose.Schema.Types.Mixed })
  coordinates!: Position | Position[] | Position[][] | Position[][][];
}

@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true }, options: { allowMixed: Severity.ALLOW } })
export class Geo {

  @Field(() => ObjectIdScalar)
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
  @Property({ type: mongoose.Schema.Types.Mixed })
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
