import path from "path";

process.env.NODE_ENV === 'development' && require('dotenv').config({ path: path.join(`${__dirname}./../.env`) });

const {
  'NODE_ENV': env,
  'DB_NAME': dbName,
  'DB_URL': dbUrl,
  'DB_PASS': dbPass,
  'DB_USER': dbUser,
  'ORIGIN_URL': originUrl,
  'SECRET_KEY': secretKey,
  'GOOGLE_CLIENT_ID': googleClientID,
  'GOOGLE_CLIENT_SECRET': googleClientSecret,
  'GOOGLE_REDIRECT_URL': googleRedirectUrl,
} = process.env;

export default {
  env,
  dbName,
  dbUrl,
  dbUser,
  dbPass,
  originUrl,
  secretKey,
  googleConfig: {
    clientId: googleClientID,
    clientSecret: googleClientSecret,
    redirectUrl: googleRedirectUrl
  }
};
