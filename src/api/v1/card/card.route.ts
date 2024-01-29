import { Request, Router } from 'express';
import { cardService } from './card.service';
import { ModifiedResponse } from '../types';

var cardRouter = Router();

cardRouter.post('/', (req: Request, res: ModifiedResponse) => {
  var { name, link } = req.body;
  // eslint-disable-next-line no-underscore-dangle
  var owner = req.user._id;
  res.promise(cardService.create({ name, link, owner }));
});

cardRouter.delete('/:cardId', (req, res: ModifiedResponse) =>
  res.promise(cardService.deleteById(req.params.cardId)),
);

cardRouter.get('/', (req, res: ModifiedResponse) => res.promise(cardService.getAll()));

cardRouter.get('/:id', (req, res: ModifiedResponse) =>
  res.promise(cardService.getById(req.params.id)),
);

export { cardRouter };