import express from 'express';
import multer from 'multer';

import multerConfig from './config/multer';
import ItemsController from './controllers/items';
import PointsController from './controllers/points';

const routes = express.Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
routes.get('/items', itemsController.list);

const pointsController = new PointsController();
routes.post('/points', upload.single('image'), pointsController.create);
routes.get('/points', pointsController.list);
routes.get('/points/:id', pointsController.get);

export default routes;
