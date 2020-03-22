import { InputType, Field } from 'type-graphql';
import { Layer, LayerProperty } from '.';
import { GraphQLJSON } from '$helpers/scalars';

@InputType()
export class LayerInput implements Partial<Layer> {

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field()
  city!: string;

  @Field(() => GraphQLJSON)
  properties!: LayerProperty[]
}
