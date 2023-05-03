import mongoose from 'mongoose';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser, IUserJWTRequest, IUserIdRequest } from '../types';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';
import {
  BAD_REQUEST, INTERNAL_SERVER_ERROR, CREATED, UNAUTHORIZED, OK, CONFLICT, randomString,
} from '../utils/constants';

const getAllUsers = (req: IUserJWTRequest, res: Response) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const getUserById = (req: IUserJWTRequest, res: Response) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь по указанному _id не найден'); }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректный _id пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req: Request, res: Response) => {
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
    .then((user: IUser) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      if (err.code === 1100) {
        return res.status(CONFLICT).send({ message: 'Пользователь с указанным логином уже существует' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const editProfile = (req: IUserJWTRequest, res: Response) => { //
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
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const editAvatar = (req: IUserJWTRequest, res: Response) => {
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
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(UNAUTHORIZED).send({ message: 'Неверный пароль или логин' });
      }

      const token = jwt.sign(
        { _id: user._id },
        randomString,
        { expiresIn: '7d' },
      );
      res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true });
      return res.status(OK).send(token);
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getCurrentUser = (req: IUserJWTRequest, res: Response) => {
  const id = req.user as IUserIdRequest;

  User.findById(id)
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь не найден'); }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректный _id пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

export {
  createUser, getAllUsers, getUserById, editProfile, editAvatar, login, getCurrentUser,
};
