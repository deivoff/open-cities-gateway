import { Field, ObjectType } from 'type-graphql';
import { arrayProp as Properties, prop as Property, Ref } from '@typegoose/typegoose';
import { User, UserType } from '$components/user';

@ObjectType()
abstract class AccessGroup {

  @Field(() => [User], { nullable: true})
  @Properties({ ref: User })
  group?: Ref<User>[];

}

@ObjectType()
abstract class AccessSettings extends AccessGroup{

  @Field(() => Boolean, { nullable: true})
  @Property({ default: false })
  anyone?: boolean;

  @Field(() => UserType, { nullable: true})
  @Property({ enum: UserType })
  role?: UserType;
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

  @Field(() => AccessGroup)
  @Property({ required: true, _id: false })
  coowner!: AccessGroup;
}
