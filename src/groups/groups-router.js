const express = require('express');
const GroupsService = require('./groups-service');
const xss = require('xss');
const groupsRouter = express.Router();

const serializeGroup = (group) => ({
  id: group.id,
  group_name: xss(group.group_name)
});

groupsRouter.route('/').get((req, res, next) => {
  const knexInstance = req.app.get('db');
  GroupsService.getAllGroups(knexInstance)
    .then((groups) => {
      res.json(groups.map(serializeGroup));
    })
    .catch((err) => {
      console.log({ err });
      next();
    });
});

module.exports = groupsRouter;
