import { GeometryType } from '.';
import { Field } from 'type-graphql';
import { prop as Property } from '@typegoose/typegoose/lib/prop';
import { modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    discriminatorKey: 'type',
  }
})
export class BaseGeometry {
  @Field(() => GeometryType)
  @Property({ required: true, enum: GeometryType })
  type!: GeometryType;
}

export class Point {
  type!: GeometryType.Point;
  coordinates!: Position;
}

export class MultiPoint {
  type!: GeometryType.MultiPoint;
  coordinates!: Position[];
}

export class LineString {
  type!: GeometryType.LineString;
  coordinates!: Position[];
}

export class MultiLineString {
  type!: GeometryType.MultiLineString;
  coordinates!: Position[][];
}

export class Polygon {
  type!: GeometryType.Polygon;
  coordinates!: Position[][];
}

export class MultiPolygon {
  type!: GeometryType.MultiPolygon;
  coordinates!: Position[][][];
}

export type Position = [number, number] | [number, number, number];
