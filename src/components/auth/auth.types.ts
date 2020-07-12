import { ObjectType, Field } from 'type-graphql';
import { UserName, UserPhoto, USER_ROLE } from '../user';

@ObjectType()
export class AuthResponse {

  @Field()
  token!: string;

}

@ObjectType()
export class AuthRedirect {

  @Field()
  url!: string;

}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  profile: any;
}

export interface DecodedToken {
  id: string;
  email: string;
  name: UserName;
  photos?: UserPhoto[];
  access: USER_ROLE;
  exp: number;
}
