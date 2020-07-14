import { Field, InputType } from 'type-graphql';
import { Layer, LayerSetting } from '.';
import { GraphQLJSON } from '$helpers/scalars';

@InputType()
export class LayerInput implements Partial<Layer> {

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => GraphQLJSON)
  configuration!: Map<string, LayerSetting>

}
