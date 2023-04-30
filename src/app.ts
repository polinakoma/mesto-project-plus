import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { IUserRequest } from './types';
import userRouter from './routes/userRouter';
import cardRouter from './routes/cardRouter';

const { PORT = 3000 } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

// мидлвар добавляет в каждый запрос объект user
app.use((req: IUserRequest, _res, next) => {
  req.user = {
    _id: '644cdd9ef5242b4f7e66b22a',
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик
app.use((
  err: { statusCode: number; message: any; },
  _req: Request,
  res: Response,
  // next: NextFunction,
) => {
  res.status(err.statusCode).send({
    message: err.statusCode === 500
      ? 'На сервере произошла ошибка'
      : err.message,
  });
});

app.listen(PORT);
