import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { randomString } from '../utils/constants';
import UnauthorizedError from '../errors/unathorized';
import { IUserJWTRequest } from '../types';

// eslint-disable-next-line consistent-return
export default (req: IUserJWTRequest, res: Response, next: NextFunction) => {
  const cookie = req.cookies.token;

  if (!cookie) {
    next(new UnauthorizedError('Необходима авторизироваться'));
  }

  let payload;

  try {
    payload = jwt.verify(cookie, randomString);
  } catch {
    next(new UnauthorizedError('Необходима авторизироваться'));
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
