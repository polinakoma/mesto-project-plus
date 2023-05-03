import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from '../utils/constants';
import { IUserJWTRequest } from '../types';

// eslint-disable-next-line consistent-return
export default (req: IUserJWTRequest, res: Response, next: NextFunction) => {
  const cookie = req.cookies.token;

  if (!cookie) {
    return res.status(UNAUTHORIZED).send('Необходима авторизация');
  }
  const token = cookie.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch {
    return res.status(UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
