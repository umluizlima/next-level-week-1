import express from 'express';

import PointsController from './controllers/points';
import knex from './database/connection';

const routes = express.Router();

routes.get('/items', async (request, response) => {
  const items = await knex('items').select('*');
  const serializedItems = items.map(item => ({
    id: item.id,
    title: item.title,
    image_url: `http://localhost:3333/uploads/${item.image}`,
  }));
  return response.json(serializedItems);
});

const pointsController = new PointsController();
routes.post('/points', pointsController.create);

export default routes;
