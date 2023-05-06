import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';
import { URL_REGEXP } from '../utils/constants';
import UnauthorizedError from '../errors/unathorized';

interface UserModel extends mongoose.Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) =>
  Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: false,
    default: 'Жак-Ив Кусто',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email: string) => validator.isEmail(email),
      message: 'Введите адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    // странно, что метод ниже не работает
    select: false, // хеш пароля пользователя не будет возвращаться из базы
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: false,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url: string) => URL_REGEXP.test(url),
      message: 'Неправильный адрес электронной почты',
    },
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user: IUser) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched: boolean) => {
          if (!matched) {
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
});

// создаём модель и экспортируем
export default mongoose.model<IUser, UserModel>('user', userSchema);
