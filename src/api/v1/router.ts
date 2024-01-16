import { Router } from 'express';
import { docRouter } from './docs';

var router = Router();
export var BASE_PATH = '/api/v1';

router.use('/docs', docRouter);
router.get('/', (req, res) => {
  res.send('Home Route');
});

export { router };