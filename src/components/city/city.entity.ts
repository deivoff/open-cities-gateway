import {
  ObjectType, Field, ID
} from 'type-graphql';
import { ObjectId } from 'mongodb';
import { getModelForClass, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Map } from '$components/map';

@ObjectType()
export class City {

  @Field(() => ID)
  readonly _id!: ObjectId;

  @Field()
  @Property({ required: true })
  name!: string;

  @Field()
  @Property({ required: true })
  url!: string;

  @Field()
  @Property({ required: true })
  photo!: string;

  @Field(() => Map)
  @Property({ ref: Map})
  map!: Ref<Map>

}

export type CityModel = ReturnModelType< typeof City>
export const CityModel: CityModel = getModelForClass(City);
