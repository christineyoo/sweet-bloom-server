const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeItemsArray, makeGroupsArray } = require('./sweetbloom.fixtures');

describe('Items endpoints', function () {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () =>
    db.raw('TRUNCATE groups, items RESTART IDENTITY CASCADE')
  );

  afterEach('cleanup', () =>
    db.raw('TRUNCATE groups, items RESTART IDENTITY CASCADE')
  );

  //   get all
  describe('GET /api/items', () => {
    context('Given no items', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/items').expect(200, []);
      });
    });

    context('Given there are items in the database', () => {
      const testGroups = makeGroupsArray();
      const testItems = makeItemsArray();
      beforeEach('Insert items', () => {
        return db
          .into('groups')
          .insert(testGroups)
          .then(() => {
            return db.into('items').insert(testItems);
          });
      });
      it('GET /api/items responds with 200 and all the items', () => {
        return supertest(app).get('/api/items').expect(200, testItems);
      });
    });
  });

  //   get by id
  describe('GET /api/items/:item_id', () => {
    context('Given no items', () => {
      it('responds with 404', () => {
        const itemId = 123456;
        return supertest(app)
          .get(`/api/items/${itemId}`)
          .expect(404, { error: { message: `Item doesn't exist` } });
      });
    });

    context('Given there are items in the database', () => {
      const testGroups = makeGroupsArray();
      const testItems = makeItemsArray();
      beforeEach('Insert items', () => {
        return db
          .into('groups')
          .insert(testGroups)
          .then(() => {
            return db.into('items').insert(testItems);
          });
      });
      it('responds with 200 and the specified item', () => {
        const itemId = 2;
        const expectedPost = testItems[itemId - 1];
        return supertest(app)
          .get(`/api/items/${itemId}`)
          .expect(200, expectedPost);
      });
    });
  });
});