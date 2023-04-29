import mongoose from 'mongoose';
import { Request } from 'express';

export interface IUser {
  name: string,
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

export interface IUserRequest extends Request {
  user?: {
    _id: string;
  }
}
