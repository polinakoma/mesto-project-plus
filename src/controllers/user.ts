import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import BadRequestError from '../errors/bad-request';
import ConflictError from '../errors/conflict';
import { IUser, IUserJWTRequest, IUserIdRequest } from '../types';
import User from '../models/user';
import NotFoundError from '../errors/not-found';
import { CREATED, randomString } from '../utils/constants';

const getAllUsers = (req: IUserJWTRequest, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
};

const getUserById = (req: IUserJWTRequest, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь по указанному _id не найден'); }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректный _id пользователя'));
      }
      return next(err);
    });
};

const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user: IUser) => res.status(CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 1100) {
        return next(new ConflictError('Пользователь с указанным логином уже существует'));
      }
      return next(err);
    });
};

const editProfile = (req: IUserJWTRequest, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const id = req.user as IUserIdRequest;

  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь с указанным _id не найден'); }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

const editAvatar = (req: IUserJWTRequest, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const id = req.user as IUserIdRequest;

  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь с указанным _id не найден'); }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      }
      return next(err);
    });
};

const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        randomString,
        { expiresIn: '7d' },
      );
      // Если я правильно поняла, то здесь нужно выбрать один из вариантов отправки токена
      return res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true });
      // return res.send(token);
    })
    .catch((err) => next(err));
};

const getCurrentUser = (req: IUserJWTRequest, res: Response, next: NextFunction) => {
  const id = req.user as IUserIdRequest;

  User.findById(id)
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь не найден'); }
      res.send(user);
    })
    .catch((err) => next(err));
};

export {
  createUser, getAllUsers, getUserById, editProfile, editAvatar, login, getCurrentUser,
};
