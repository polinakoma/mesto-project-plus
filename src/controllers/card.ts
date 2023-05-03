import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { IUserIdRequest, IUserJWTRequest } from '../types';
import Card from '../models/card';
import NotFoundError from '../errors/not-found-err';
import {
  BAD_REQUEST, INTERNAL_SERVER_ERROR, CREATED, FORBIDDEN,
} from '../utils/constants';

const createCard = async (req: IUserJWTRequest, res: Response) => {
  const { name, link } = req.body;
  const id = req.user as IUserIdRequest;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const getAllCards = (req: Request, res: Response) => {
  Card.find({})
    .populate(['likes', 'owner'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

const deleteCardById = (req: IUserJWTRequest, res: Response) => {
  const id = req.user as IUserIdRequest;

  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) { throw new NotFoundError('Передан несуществующий _id карточки'); }
      if (String(card.owner) !== String(id)) {
        res.status(FORBIDDEN).send({ message: 'Вы можете удалить только свои карточки' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Передан неверный _id карточки' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const putLike = (req: IUserJWTRequest, res: Response) => {
  const id = req.user as IUserIdRequest;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['likes', 'owner'])
    .then((card) => {
      if (!card) { throw new NotFoundError('Передан несуществующий _id карточки'); }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteLike = (req: IUserJWTRequest, res: Response) => {
  const id = req.user as IUserIdRequest;

  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['likes', 'owner'])
    .then((card) => {
      if (!card) { throw new NotFoundError('Передан несуществующий _id карточки'); }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

export {
  createCard, getAllCards, deleteCardById, putLike, deleteLike,
};
