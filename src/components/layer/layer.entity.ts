import {
  prop as Property, Ref, arrayProp as Properties, modelOptions, getModelForClass, ReturnModelType,
} from '@typegoose/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { User } from '../user';
import { GraphQLJSON } from '$helpers/scalars';
import { Access } from '$components/access';

export class LayerSettings {
  @Property({ required: true })
  key!: string;

  @Property({ required: true })
  name!: string;

  @Property({ required: true })
  type!: string;

  @Properties({ items: Array })
  nested?: LayerSettings[];
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
  @Properties({ items: Array })
  settings?: LayerSettings[];
}
export type LayerModel = ReturnModelType<typeof Layer>;
export const LayerModel: LayerModel = getModelForClass(Layer);
