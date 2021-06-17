const express = require('express');
const ItemsService = require('./items-service');
const xss = require('xss');
const itemsRouter = express.Router();

const serializeItem = (item) => ({
  id: item.id,
  item_name: xss(item.item_name),
  item_price: item.item_price,
  item_description: xss(item.item_description),
  item_url: xss(item.item_url),
  group_id: item.group_id
});

itemsRouter.route('/').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  ItemsService.getAllItems(knexInstance)
    .then((items) => {
      res.json(items.map(serializeItem));
    })
    .catch((err) => {
      console.log({ err });
      next();
    });
});

itemsRouter
  .route('/:item_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    ItemsService.getById(knexInstance, req.params.item_id)
      .then((item) => {
        if (!item) {
          return res
            .status(404)
            .json({ error: { message: `Item doesn't exist` } });
        }
        res.item = item;
        next();
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  })
  .get((req, res, next) => {
    res.json(serializeItem(res.item));
  });

module.exports = itemsRouter;
