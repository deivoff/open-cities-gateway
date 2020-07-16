import { getModelForClass, prop as Property } from '@typegoose/typegoose';
import jwt from 'jsonwebtoken';
import CONFIG from '$configs/index';
import { Field, ObjectType } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from '$helpers/scalars';
import { USER_ROLE } from '.';
import { AuthData } from '../auth';

@ObjectType()
export class UserPhoto {

  @Field(() => String)
  @Property({ required: true })
  url!: string;

}

@ObjectType()
class GoogleProvider {

  @Field()
  @Property({ required: true })
  id!: string;

  @Field()
  @Property({ required: true })
  token!: string;

}

@ObjectType()
class UserSocial {

  @Field(() => GoogleProvider)
  @Property({ _id: false })
  googleProvider!: GoogleProvider;

}

@ObjectType()
export class UserName {

  @Field(() => String)
  @Property({ required: true })
  familyName!: string;

  @Field(() => String)
  @Property({ required: true })
  givenName!: string;

}

@ObjectType()
export class User {

  @Field(() => ObjectIdScalar)
  readonly _id!: ObjectId;

  @Field()
  @Property({ required: true })
  email!: string;

  @Field(() => UserName)
  @Property({ _id: false })
  name!: UserName;

  @Field(() => USER_ROLE)
  @Property({ required: true, enum: USER_ROLE })
  role!: USER_ROLE;

  @Field(() => [UserPhoto])
  @Property({ type: UserPhoto, _id: false })
  photos?: UserPhoto[];

  @Field(() => UserSocial)
  @Property({ _id: false })
  social!: UserSocial;

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
      CONFIG.secretKey!,
    );
  }

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
          role: USER_ROLE.USER,
        });
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

}

export const UserModel = getModelForClass(User);
