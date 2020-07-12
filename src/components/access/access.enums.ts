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

export const ACCESS_FIELDS = ['view', 'comment', 'edit', 'coowner'];

registerEnumType(AccessType, {
  name: 'AccessType', // this one is mandatory
});

registerEnumType(ACCESS_CODE, {
  name: 'ACCESS_CODE'
});
