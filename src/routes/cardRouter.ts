import { Router } from 'express';
import {
  createCard, getAllCards, deleteCardById, putLike, deleteLike,
} from '../controllers/card';

const cardRouter = Router();

cardRouter.post('/cards', createCard);
cardRouter.get('/cards', getAllCards);
cardRouter.delete('/cards/:cardId', deleteCardById);
cardRouter.put('/cards/:cardId/likes', putLike);
cardRouter.delete('/cards/:cardId/likes', deleteLike);

export default cardRouter;
