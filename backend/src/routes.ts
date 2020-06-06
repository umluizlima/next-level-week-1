import express from 'express';

import ItemsController from './controllers/items';
import PointsController from './controllers/points';

const routes = express.Router();

const itemsController = new ItemsController();
routes.get('/items', itemsController.list);

const pointsController = new PointsController();
routes.post('/points', pointsController.create);

export default routes;
