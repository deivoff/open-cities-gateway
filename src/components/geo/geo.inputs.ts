import { InputType, Field, ID } from 'type-graphql';
import { GeoJsonProperties } from 'geojson';
import { Geo, Geometry } from '.';
import { GraphQLJSON } from '$helpers/scalars';
import { Layer } from '../layer';
import { User, UserType } from '$components/user';

@InputType()
export class GeoInput implements Partial<Geo> {

  @Field(() => Geometry)
  geometry!: Geometry;

  @Field(() => GraphQLJSON)
  properties!: GeoJsonProperties;

  @Field(() => ID)
  layer!: Layer;

}

@InputType()
export class GeoInputExtended implements Partial<Geo> {

  @Field(() => Geometry)
  geometry!: Geometry;

  @Field(() => GraphQLJSON)
  properties!: GeoJsonProperties;

  @Field(() => ID)
  layer!: Layer;

  @Field(() => ID)
  author!: User;

  @Field(() => UserType)
  access!: UserType;

}
