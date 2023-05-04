import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UNAUTHORIZED, randomString } from '../utils/constants';
import { IUserJWTRequest } from '../types';

// eslint-disable-next-line consistent-return
export default (req: IUserJWTRequest, res: Response, next: NextFunction) => {
  const cookie = req.cookies.token;

  if (!cookie) {
    return res.status(UNAUTHORIZED).send('Необходима авторизация');
  }

  let payload;

  try {
    payload = jwt.verify(cookie, randomString);
  } catch {
    return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
