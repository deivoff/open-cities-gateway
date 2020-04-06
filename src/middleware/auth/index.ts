import jwt from 'jsonwebtoken';
import path from 'path';
import { Context } from '$types/index';
import { DecodedToken } from '$components/auth';
import { AuthChecker } from 'type-graphql';
import { UserType } from '$components/user';


require('dotenv').config({ path: path.join(`${__dirname}./../../../.env`) });

export const isAuth = async (ctx: Context, next: () => Promise<any>) => {
  const authHeader = ctx.header.authorization;
  if (!authHeader) {
    ctx.state.isAuth = false;
    return await next();
  }

  const token = authHeader.split(' ')[1];
  if (!token || token === '') {
    ctx.state.isAuth = false;
    return await next();
  }
  let decodedToken: string | object;
  try {
    decodedToken = jwt.verify(token, process.env.SECRET_KEY!);
  } catch {
    ctx.state.isAuth = false;
    return await next();
  }

  if (!decodedToken) {
    ctx.state.isAuth = false;
    return await next();
  }

  ctx.state.isAuth = true;
  ctx.state.decodedUser = decodedToken as DecodedToken;
  return await next();
};

export const authChecker: AuthChecker<{ ctx: Context }, UserType> = ({ context: { ctx: { state} }}, roles) => {
  if (!state.isAuth) return false;

  if (roles.length === 0) return true;

  if (state.decodedUser?.access === UserType.admin) return true;

  return roles.includes(<UserType>state.decodedUser?.access);

};
