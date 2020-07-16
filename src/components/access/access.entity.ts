import { Field, ObjectType } from 'type-graphql';
import { prop as Property, Ref } from '@typegoose/typegoose';
import { User, USER_ROLE } from '$components/user';

@ObjectType()
abstract class AccessGroup {

  @Field(() => [User], { nullable: true })
  @Property({ ref: User, default: [] })
  group?: Ref<User>[];

}

@ObjectType()
abstract class AccessSettings extends AccessGroup {

  @Field(() => Boolean, { nullable: true})
  @Property({ default: false })
  anyone?: boolean;

  @Field(() => USER_ROLE, { nullable: true})
  @Property({ enum: USER_ROLE })
  role?: USER_ROLE;
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
