import { Router } from 'express';
import {
  createUser, getAllUsers, getUserById, editProfile, editAvatar,
} from '../controllers/user';

const userRouter = Router();

userRouter.get('/users', getAllUsers);
userRouter.get('/users/:userId', getUserById);
userRouter.post('/users', createUser);
userRouter.patch('/users/me', editProfile);
userRouter.patch('/users/me/avatar', editAvatar);

export default userRouter;
