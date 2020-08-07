import { Field, InputType } from 'type-graphql';
import { HexColorScalar, Layer, LayerSetting } from '.';
import { GraphQLJSON } from '$helpers/scalars';

@InputType()
export class LayerInput implements Partial<Layer> {

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => HexColorScalar)
  color!: string;

  @Field(() => GraphQLJSON)
  configuration!: Map<string, LayerSetting>

}
