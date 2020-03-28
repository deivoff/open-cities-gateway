import { registerEnumType } from 'type-graphql';

export enum UserType {
  admin = 'admin',
  researcher = 'researcher',
  user = 'user',
}

registerEnumType(UserType, {
  name: 'UserType', // this one is mandatory
});
