import {
  DocumentType,
  getModelForClass,
  mapProp as MapProperty,
  modelOptions,
  prop as Property,
  Ref,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Field, ID, ObjectType } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { User } from '../user';
import { GraphQLJSON } from '$helpers/scalars';
import { Access, ACCESS_CODE, getAccessCode } from '$components/access';
import { DecodedToken } from '$components/auth';

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

  @Property({ required: true, _id: false })
  _access!: Access;

  @Field(() => ACCESS_CODE)
  access?: ACCESS_CODE;

  @Field(() => GraphQLJSON)
  @MapProperty({ of: LayerSetting })
  settings?: Map<string, LayerSetting>;

  static getAllowed = (
    user?: DecodedToken
  ) => async (
    ...parameters: Parameters<DocumentType<LayerModel>['find']>
  ) => {
    const layers = await LayerModel.find(...parameters);
    return layers.reduce((acc, layer) => {
      let { _access } = layer;
      const accessCode = getAccessCode(_access, user);

      if (accessCode) {
        layer.access = accessCode;
        acc.push(layer);
      }

      return acc;
    }, [] as Layer[]);
  }
}

export type LayerModel = ReturnModelType<typeof Layer>;
export const LayerModel: LayerModel = getModelForClass(Layer);
