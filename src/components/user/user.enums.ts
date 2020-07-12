import { registerEnumType } from 'type-graphql';

export enum USER_ROLE {
  ADMIN = 'ADMIN',
  RESEARCHER = 'RESEARCHER',
  USER = 'USER',
}

registerEnumType(USER_ROLE, {
  name: 'USER_ROLE', // this one is mandatory
});
