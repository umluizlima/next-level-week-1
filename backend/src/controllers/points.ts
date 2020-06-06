import { Request, Response } from 'express';

import knex from '../database/connection';

class PointsController {
  async list(request: Request, response: Response) {
    const { city, uf, items } = request.query;
    
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    let query = knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
    if (parsedItems.length > 0) {
      query = query.whereIn('point_items.item_id', parsedItems);
    }
    if (city) {
      query = query.where('city', String(city));
    }
    if (uf) {
      query = query.where('uf', String(uf))
    }
      
    const points = await query
      .distinct()
      .select('points.*');

    return response.json(points);
  }

  async get(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();
    if (!point) {
      return response.status(404).json({ message: 'Point not found.' });
    }

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({ point, items });
  }

  async create(request: Request, response: Response) {
    const {
      name, email, whatsapp, latitude, longitude, city, uf, items,
    } = request.body;
    const trx = await knex.transaction();

    const point = {
      image: 'image-fake',
      name, email, whatsapp, latitude, longitude, city, uf,
    };

    const insertedIds = await trx('points').insert(point);

    const pointId = insertedIds[0];
    const pointItems = items.map((item_id: number) => ({
      item_id, point_id: pointId,
    }));

    await trx('point_items').insert(pointItems);
    await trx.commit();

    return response.json({ id: pointId, ...point });
  }
}

export default PointsController;
