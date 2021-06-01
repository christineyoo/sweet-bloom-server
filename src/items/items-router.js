const express = require('express');
const ItemsService = require('./items-service');
const xss = require('xss');
const itemsRouter = express.Router();

const serializeItem = (item) => ({
  id: item.id,
  item_name: xss(item.item_name),
  item_price: xss(item.item_price),
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

module.exports = itemsRouter;
