import { Request, Response } from 'express';

import knex from '../database/connection';

class PointsController {
  async create(request: Request, response: Response) {
    const {
      name, email, whatsapp, latitude, longitude, city, uf, items,
    } = request.body;
    const trx = await knex.transaction();

    const point = {
      image: 'image-fake',
      name, email, whatsapp, latitude, longitude, city, uf,
    };
    console.log(point);

    const insertedIds = await trx('points').insert(point);
    console.log(insertedIds);

    const pointId = insertedIds[0];
    const pointItems = items.map((item_id: number) => ({
      item_id, point_id: pointId,
    }));

    await trx('point_items').insert(pointItems);
    trx.commit();

    return response.json({ id: pointId, ...point });
  }
}

export default PointsController;
