import { Router } from 'express';
import {
  createCard, getAllCards, deleteCardById, putLike, deleteLike,
} from '../controllers/card';
import {
  getAllUsers, getUserById, editProfile, editAvatar, getCurrentUser,
} from '../controllers/user';
import {
  createCardValidation, cardIdValidation, getUserByIdValidator,
  getCurrentUserValidator, editProfileValidator, editAvatarValidator,
} from '../validation/JoiValidator';

export const cardRouter = Router();

cardRouter.post('/', createCardValidation, createCard);
cardRouter.get('/', getAllCards);
cardRouter.delete('/:cardId', cardIdValidation, deleteCardById);
cardRouter.put('/:cardId/likes', cardIdValidation, putLike);
cardRouter.delete('/:cardId/likes', cardIdValidation, deleteLike);

export const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:userId', getUserByIdValidator, getUserById);
userRouter.get('/me', getCurrentUserValidator, getCurrentUser);
userRouter.patch('/me', editProfileValidator, editProfile);
userRouter.patch('/me/avatar', editAvatarValidator, editAvatar);
