import { Field, ObjectType } from 'type-graphql';
import { arrayProp as Properties, prop as Property, Ref } from '@typegoose/typegoose';
import { User, UserType } from '$components/user';

@ObjectType()
abstract class AccessSettings {

  @Field(() => Boolean, { nullable: true})
  @Property({ default: false })
  anyone?: boolean;

  @Field(() => [User], { nullable: true})
  @Properties({ ref: User })
  group?: Ref<User>[];

  @Field(() => UserType, { nullable: true})
  @Property({ enum: UserType })
  role?: UserType;
}

@ObjectType()
abstract class AccessSettingsCoowner {

  @Field(() => [User], { nullable: true})
  @Properties({ ref: User })
  group?: Ref<User>[];

}

@ObjectType()
export class Access {

  @Field(() => AccessSettings)
  @Property({ required: true, _id: false })
  view!: AccessSettings;

  @Field(() => AccessSettings)
  @Property({ required: true, _id: false })
  edit!: AccessSettings;

  @Field(() => AccessSettings)
  @Property({ required: true, _id: false })
  comment!: AccessSettings;

  @Field(() => AccessSettingsCoowner)
  @Property({ required: true, _id: false })
  coowner!: AccessSettingsCoowner;
}
