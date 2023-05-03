import mongoose from 'mongoose';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IUser {
  name: string,
  email: string,
  password: string,
  about: string,
  avatar: string,
}

export interface ICard {
  name: string,
  link: string,
  owner: mongoose.Schema.Types.ObjectId,
  likes: [mongoose.Schema.Types.ObjectId],
  createdAt: Date,
}

export interface IUserIdRequest extends Request {
  _id: mongoose.Schema.Types.ObjectId;
}

export interface IUserJWTRequest extends Request {
  user?: string | JwtPayload;
}
