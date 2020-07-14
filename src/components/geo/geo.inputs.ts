import { Field, InputType } from 'type-graphql';
import { GeoJsonProperties } from 'geojson';
import { Geo, Geometry } from '.';
import { GraphQLJSON, ObjectIdScalar } from '$helpers/scalars';
import { Layer } from '../layer';

@InputType()
export class GeoInput implements Partial<Geo> {

  @Field(() => Geometry)
  geometry!: Geometry;

  @Field(() => GraphQLJSON)
  properties!: GeoJsonProperties;

  @Field(() => ObjectIdScalar)
  layer!: Layer;

}
