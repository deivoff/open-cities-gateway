import {
  prop as Property, mapProp as MapProperty,
  arrayProp as Properties, Ref,
  modelOptions, getModelForClass,
  ReturnModelType,
} from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { User } from '../user';
import { GraphQLJSON } from '$helpers/scalars';
import { Access } from '$components/access';

export class LayerNestedSetting {
  @Property({ required: true })
  key!: string;

  @Property({ required: true })
  name!: string;

  @Property()
  description?: string;

  @Property({ required: true })
  type!: string;
}

export class LayerSetting extends LayerNestedSetting{

  @MapProperty({ of: LayerNestedSetting })
  nested?: Map<string, LayerNestedSetting>

}

@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true} })
export class Layer {

  @Field(() => ID)
  readonly _id!: ObjectId;

  @Field(() => Date)
  readonly createdAt!: Date;

  @Field(() => Date)
  readonly updatedAt!: Date;

  @Field()
  @Property({ required: true })
  name!: string;

  @Field()
  @Property()
  description?: string;

  @Field(() => User)
  @Property({ required: true, ref: User })
  owner!: Ref<User>;

  @Field(() => Access)
  @Property({ required: true, _id: false })
  access!: Access;

  @Field(() => GraphQLJSON)
  @MapProperty({ of: LayerSetting })
  settings?: Map<string, LayerSetting>;
}
export type LayerModel = ReturnModelType<typeof Layer>;
export const LayerModel: LayerModel = getModelForClass(Layer);
