import {
  Resolver, Query, Arg, Mutation
} from 'type-graphql';
import { AuthResponse, AuthRedirect } from '.';
import { GoogleOAuth } from './google';
import { User } from '../user';

@Resolver(() => AuthResponse)
export class AuthResolvers {

  googleOAuth = new GoogleOAuth();

  @Query(() => AuthRedirect)
  async getGoogleOAuthRedirect(): Promise<AuthRedirect> {
    return {
      url: this.googleOAuth.urlGoogle(),
    };
  }

  @Mutation(() => AuthResponse)
  async authGoogle(@Arg('code') code: string): Promise<AuthResponse> {
    try {
      const { accessToken, refreshToken, profile } = await this.googleOAuth.serializeAccountFromCode(code);
      const user = await User.upsetGoogleUser({ accessToken, refreshToken, profile });
      const token = user.generateJWT();
      return {
        token,
      }!;
    } catch (error) {
      return error;
    }
  }

}
