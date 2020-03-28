import { registerEnumType } from 'type-graphql';

export enum AccessType {
  default = 'default',
  city = 'city',
}

registerEnumType(AccessType, {
  name: 'AccessType', // this one is mandatory
});
