import {
  arrayProp as Properties,
  instanceMethod,
  prop as Property,
  staticMethod,
  Typegoose,
} from '@hasezoey/typegoose';
import jwt from 'jsonwebtoken';
import path from 'path';
import { Document, Model } from 'mongoose';
import { Field, ID, ObjectType } from 'type-graphql';

import { ObjectId } from 'mongodb';
import { UserType } from '.';
import { AuthData } from '../auth';

require('dotenv').config({ path: path.join(`${__dirname}./../../../.env`) });
@ObjectType()
export class UserPhoto extends Typegoose {

  @Field(() => String)
  @Property({ required: true })
  url!: string;

}

@ObjectType()
class GoogleProvider extends Typegoose {

  @Field()
  @Property({ required: true })
  id!: string;

  @Field()
  @Property({ required: true })
  token!: string;

}

@ObjectType()
class UserSocial extends Typegoose {

  @Field(() => GoogleProvider)
  @Property({ _id: false })
  googleProvider!: GoogleProvider;

}

@ObjectType()
export class UserName extends Typegoose {

  @Field(() => String)
  @Property({ required: true })
  familyName!: string;

  @Field(() => String)
  @Property({ required: true })
  givenName!: string;

}

@ObjectType()
export class User extends Typegoose {

  @Field(() => ID)
  readonly _id!: ObjectId;

  @Field()
  @Property({ required: true })
  email!: string;

  @Field(() => UserName)
  @Property({ _id: false })
  name!: UserName;

  @Field(() => UserType)
  @Property({ required: true, enum: UserType })
  role!: UserType;

  @Field(() => [UserPhoto])
  @Properties({ items: UserPhoto, _id: false })
  photos?: UserPhoto[];

  @Field(() => UserSocial)
  @Property({ _id: false })
  social!: UserSocial;

  @instanceMethod
  generateJWT() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: this.email,
        name: this.name,
        photos: this.photos ? this.photos : [],
        access: this.role,
        id: this._id,
        exp: expirationDate.getTime() / 1000,
      },
      process.env.SECRET_KEY!,
    );
  }

  @staticMethod
  static async upsetGoogleUser({ accessToken, refreshToken, profile: {
    email, name, id, photo
  } }: AuthData) {
    try {
      const user = await UserModel.findOne({ 'social.googleProvider.id': id });

      if (!user) {
        return await UserModel.create({
          name,
          email,
          'social.googleProvider': {
            id,
            token: accessToken,
          },
          photos: [{ url: photo }],
          role: UserType.user,
        });
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

}

export type UserDocument = User & Document;
export interface UserModel extends Model<UserDocument> {
  upsetGoogleUser: (data: AuthData) => Promise<UserDocument>;
  generateJWT: () => string;
}
export const UserModel: UserModel = new User().getModelForClass(User);
