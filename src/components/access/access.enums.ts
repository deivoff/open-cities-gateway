import { registerEnumType } from 'type-graphql';

export enum AccessType {
  default = 'default',
  city = 'city',
}

export enum ACCESS_CODE {
  NONE,
  VIEW ,
  COMMENT,
  EDIT,
  COOWNER,
}

registerEnumType(AccessType, {
  name: 'AccessType', // this one is mandatory
});

registerEnumType(ACCESS_CODE, {
  name: 'ACCESS_CODE'
});
