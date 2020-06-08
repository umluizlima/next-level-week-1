import { celebrate, Joi } from 'celebrate';
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
routes.post(
  '/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().regex(RegExp('^\\d(,\\d)*$')).required(),
    })
  }, {
    abortEarly: false,
  }),
  pointsController.create,
);
routes.get('/points', pointsController.list);
routes.get('/points/:id', pointsController.get);

export default routes;
