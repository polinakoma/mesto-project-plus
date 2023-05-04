import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors, Joi, celebrate } from 'celebrate';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRouter';
import cardRouter from './routes/cardRouter';
import { NOT_FOUND } from './utils/constants';
import { login, createUser } from './controllers/user';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';

const { PORT = 3000 } = process.env;

// GET /users/me — не возвращает информацию о текущем пользователе.

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger); // подключаем логер запросов

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).rule({ message: 'Именя должна быть от 2 до 30 символов' }),
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
    about: Joi.string().min(2).max(200).rule({ message: 'Введите от 2 до 30 символов' }),
    avatar: Joi.string(),
  }),
}), createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.get('*', (req: Request, res: Response) => {
  res.status(NOT_FOUND).send('Страница не найдена');
});

app.use(errorLogger); // подключаем логер ошибок

app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик
app.use((
  err: { statusCode: number; message: any; },
  _req: Request,
  res: Response,
) => {
  res.status(err.statusCode).send({
    message: err.statusCode === 500
      ? 'На сервере произошла ошибка'
      : err.message,
  });
});

app.listen(PORT);
