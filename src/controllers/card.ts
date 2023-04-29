import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { IUserRequest } from '../types';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-err';
import { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR } from '../utils/constants';

const createCard = async (req: IUserRequest, res: Response) => {
  const { name, link } = req.body;
  const id = req.user?._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getAllCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => {
      if (!cards) { throw new NotFoundError('Запрашиваемые карточки не найдены'); }
      res.send(cards);
    })
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const deleteCardById = (req: Request, res: Response) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send(card))
    .catch(() => res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена' }));
};

const putLike = (req: IUserRequest, res: Response) => {
  const id = req.user?._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) { throw new NotFoundError('Передан несуществующий _id карточки'); }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteLike = (req: IUserRequest, res: Response) => {
  const id = req.user?._id;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) { throw new NotFoundError('Передан несуществующий _id карточки'); }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

export {
  createCard, getAllCards, deleteCardById, putLike, deleteLike,
};
