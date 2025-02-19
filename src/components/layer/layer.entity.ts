import {
  DocumentType,
  getModelForClass,
  modelOptions,
  mongoose,
  prop as Property,
  Ref,
  ReturnModelType,
} from '@typegoose/typegoose';
import { Field, Maybe, ObjectType } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { User } from '../user';
import { GraphQLJSON, ObjectIdScalar } from '$helpers/scalars';
import { Access, ACCESS_CODE, checkAccess } from '$components/access';
import { DecodedToken } from '$components/auth';
import { GeoJsonProperties } from 'geojson';
import { HexColorScalar } from '.';

export class LayerNestedSetting {
  @Property({ required: true })
  key!: string;

  @Property({ required: true })
  name!: string;

  @Property()
  description?: string;

  @Property({ required: true })
  type!: string;

  @Property({ required: true })
  hide!: boolean;
}

export class LayerSetting extends LayerNestedSetting{

  @Property({ of: LayerNestedSetting })
  nested?: Map<string, LayerNestedSetting>

}

@ObjectType()
@modelOptions({ schemaOptions: { timestamps: true} })
export class Layer {

  @Field(() => ObjectIdScalar)
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

  @Field(() => HexColorScalar)
  @Property({ required: true })
  color!: string;

  @Field(() => User)
  @Property({ required: true, ref: User })
  owner!: Ref<User>;

  @Property({ required: true, _id: false })
  _access!: Access;

  @Field(() => ACCESS_CODE)
  access?: ACCESS_CODE;

  @Field(() => GraphQLJSON)
  @Property({ type: mongoose.Schema.Types.Mixed })
  configuration?: GeoJsonProperties;


  static async getAllowed(
    user?: DecodedToken,
    ...parameters: (Parameters<DocumentType<LayerModel>['find']>) | any
  ) {
    const layers = await LayerModel.find(...parameters);
    return layers.reduce((acc, layer) => {
      let { _access, owner } = layer;
      const accessExist = checkAccess({
        access: _access,
        owner: owner as ObjectId,
      }, user);

      if (accessExist) {
        acc.push(layer);
      } else {
        acc.push(null)
      }

      return acc;
    }, [] as Maybe<Layer>[]);
  }
}

export type LayerModel = ReturnModelType<typeof Layer>;
export const LayerModel: LayerModel = getModelForClass(Layer);
