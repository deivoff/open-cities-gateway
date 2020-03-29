import { InputType, Field } from 'type-graphql';
import { Layer, LayerSettings } from '.';
import { GraphQLJSON } from '$helpers/scalars';

@InputType()
export class LayerInput implements Partial<Layer> {

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => GraphQLJSON)
  properties!: LayerSettings[]

}
