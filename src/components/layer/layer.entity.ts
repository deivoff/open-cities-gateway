import {
  prop as Property, Typegoose, Ref, arrayProp as Properties
} from '@hasezoey/typegoose';
import { ObjectType, Field, ID } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { Model, Document } from 'mongoose';
import { User, UserType } from '../user';
import { GraphQLJSON } from '$helpers/scalars';

export class LayerProperty {
  @Property({ required: true })
  key!: string;

  @Property({ required: true })
  name!: string;

  @Property({ required: true })
  type!: string;

  @Properties({ items: Array })
  nested?: Ref<LayerProperty>[];
}

@ObjectType()
export class Layer extends Typegoose {

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

  @Field(() => UserType)
  @Property({ required: true, enum: UserType })
  access!: UserType;

  @Field()
  @Property({ required: true })
  city!: string;

  @Field(() => [User])
  @Properties({ itemsRef: { name: 'User' } })
  subscribers?: Ref<User[]>;

  @Field(() => GraphQLJSON)
  @Properties({ items: Array })
  properties?: LayerProperty[];
}

export type LayerDocument = Layer & Document;
export type LayerModel = Model<LayerDocument>;
export const LayerModel: LayerModel = new Layer().getModelForClass(Layer, { schemaOptions: { timestamps: true } });
