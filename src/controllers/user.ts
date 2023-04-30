import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { IUserRequest } from '../types';
import User from '../models/user';
import NotFoundError from '../errors/not-found-err';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, CREATED } from '../utils/constants';

const getAllUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const getUserById = (req: IUserRequest, res: Response) => {
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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const editProfile = (req: IUserRequest, res: Response) => { //
  const { name, about } = req.body;
  const id = req.user?._id;

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
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const editAvatar = (req: IUserRequest, res: Response) => { //
  const { avatar } = req.body;
  const id = req.user?._id;

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
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

export {
  createUser, getAllUsers, getUserById, editProfile, editAvatar,
};
