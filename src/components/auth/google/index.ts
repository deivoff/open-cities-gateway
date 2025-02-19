// eslint-disable-next-line @typescript-eslint/camelcase
import { google, plus_v1 } from 'googleapis';
import CONFIG from '$configs/index';

export class GoogleOAuth {

  /** **************** */
  /** CONFIGURATION * */
  /** **************** */

  googleConfig = CONFIG.googleConfig;

  defaultScope = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  /** ********** */
  /** HELPERS * */
  /** ********** */

  auth = new google.auth.OAuth2(
    this.googleConfig.clientId,
    this.googleConfig.clientSecret,
    this.googleConfig.redirectUrl,
  );

  getConnectionUrl(): string {
    return this.auth.generateAuthUrl({
      // eslint-disable-next-line @typescript-eslint/camelcase
      access_type: 'offline',
      prompt: 'consent',
      scope: this.defaultScope,
    });
  }

  // eslint-disable-next-line @typescript-eslint/camelcase
  getGooglePlusApi(): plus_v1.Plus {
    return google.plus({ version: 'v1', auth: this.auth });
  }

  urlGoogle(): string {
    const url = this.getConnectionUrl();
    return url;
  }

  async serializeAccountFromCode(code: string) {
    try {
      const data = await this.auth.getToken(code);
      const { tokens } = data;
      this.auth.setCredentials(tokens);
      const plus = this.getGooglePlusApi();
      const me = await plus.people.get({ userId: 'me' });
      const userGoogleId = me.data.id;
      const userName = {
        familyName: me.data.name!.familyName!,
        givenName: me.data.name!.givenName!,
      };
      const userPhoto = me.data.image!.url;
      const userGoogleEmail = me.data.emails![0].value;
      return {
        accessToken: tokens.access_token!,
        refreshToken: tokens.refresh_token!,
        profile: {
          id: userGoogleId!,
          email: userGoogleEmail!,
          name: userName,
          photo: userPhoto!,
        },
      };
    } catch (error) {
      throw error;
    }
  }

}
