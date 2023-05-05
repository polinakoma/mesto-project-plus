import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import { userRouter, cardRouter } from './routes/index';
import { INTERNAL_SERVER_ERROR } from './utils/constants';
import { login, createUser } from './controllers/user';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import { signinValidator, signupValidator } from './validation/JoiValidator';
import NotFoundError from './errors/not-found';

const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger); // подключаем логер запросов

app.post('/signin', signinValidator, login);
app.post('/signup', signupValidator, createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключаем логер ошибок

app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик
app.use((
  err: { statusCode: number; message: string; },
  _req: Request,
  res: Response,
) => {
  res.status(err.statusCode).send({
    message: err.statusCode === INTERNAL_SERVER_ERROR
      ? 'На сервере произошла ошибка'
      : err.message,
  });
});

app.listen(PORT);
