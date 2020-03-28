import { Field, InputType } from 'type-graphql';
import { Map, MapSettings } from '.';

@InputType()
export class MapInput implements Partial<Map> {

  @Field()
  name!: string;

  @Field()
  description!: string;

  @Field(() => MapSettings)
  settings!: MapSettings;

}
