import { Router } from 'express';
import {
  createCard, getAllCards, deleteCardById, putLike, deleteLike,
} from '../controllers/card';

const cardRouter = Router();

cardRouter.post('/', createCard);
cardRouter.get('/', getAllCards);
cardRouter.delete('/:cardId', deleteCardById);
cardRouter.put('/:cardId/likes', putLike);
cardRouter.delete('/:cardId/likes', deleteLike);

export default cardRouter;
