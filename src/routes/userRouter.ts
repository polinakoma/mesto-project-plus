import { Router } from 'express';
import {
  createUser, getAllUsers, getUserById, editProfile, editAvatar,
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.post('/', createUser);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', editProfile);
userRouter.patch('/me/avatar', editAvatar);

export default userRouter;
