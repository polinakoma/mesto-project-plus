import { Router } from 'express';
import { Joi, celebrate } from 'celebrate';
import {
  getAllUsers, getUserById, editProfile, editAvatar, getCurrentUser,
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

userRouter.get('/users/me', celebrate({
  body: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), getCurrentUser);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).rule({ message: 'Именя должна быть от 2 до 30 символов' }),
    about: Joi.string().min(2).max(200).rule({ message: 'Введите от 2 до 30 символов' }),
    id: Joi.string().alphanum().length(24),
  }),
}), editProfile);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string(),
    id: Joi.string().alphanum().length(24),
  }),
}), editAvatar);

export default userRouter;
