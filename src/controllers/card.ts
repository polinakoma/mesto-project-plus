import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';
import { IUserIdRequest, IUserJWTRequest } from '../types';
import Card from '../models/card';
import NotFoundError from '../errors/not-found';
import BadRequestError from '../errors/bad-request';
import ForbiddenError from '../errors/forbidden';
import { CREATED } from '../utils/constants';

const createCard = async (req: IUserJWTRequest, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const id = req.user as IUserIdRequest;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

const getAllCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .populate(['likes', 'owner'])
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

const deleteCardById = (req: IUserJWTRequest, res: Response, next: NextFunction) => {
  const id = req.user as IUserIdRequest;

  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) { throw new NotFoundError('Передан несуществующий _id карточки'); }
      // использовала этот метод приведения к строке, он конвертирует объект в строковый объект
      // других предположений у меня нет как прировнять значения
      // К сожалению, все карточки создаю я и проверить удаление не могу
      if (card.owner.toString() !== id.toString()) {
        throw new ForbiddenError('Вы можете удалить только свои карточки');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Передан неверный _id карточки'));
      }
      return next(err);
    });
};

const putLike = (req: IUserJWTRequest, res: Response, next: NextFunction) => {
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
        return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      return next(err);
    });
};

const deleteLike = (req: IUserJWTRequest, res: Response, next: NextFunction) => {
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
        return next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      }
      return next(err);
    });
};

export {
  createCard, getAllCards, deleteCardById, putLike, deleteLike,
};
