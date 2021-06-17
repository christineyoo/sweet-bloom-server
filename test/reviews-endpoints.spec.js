const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const {
  makeReviewsArray,
  makeItemsArray,
  makeGroupsArray
} = require('./sweetbloom.fixtures');

describe('Reviews endpoints', function () {
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
    db.raw('TRUNCATE groups, items, reviews RESTART IDENTITY CASCADE')
  );

  afterEach('cleanup', () =>
    db.raw('TRUNCATE groups, items, reviews RESTART IDENTITY CASCADE')
  );

  //   get all
  describe('GET /api/reviews', () => {
    context('Given no reviews', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app).get('/api/reviews').expect(200, []);
      });
    });

    context('Given there are reviews in the database', () => {
      const testGroups = makeGroupsArray();
      const testItems = makeItemsArray();
      const testReviews = makeReviewsArray();
      beforeEach('Insert reviews', () => {
        return db
          .into('groups')
          .insert(testGroups)
          .then(() => {
            return db.into('items').insert(testItems);
          })
          .then(() => {
            return db.into('reviews').insert(testReviews);
          });
      });
      it('GET /api/reviews responds with 200 and all the reviews', () => {
        return supertest(app).get('/api/reviews').expect(200, testReviews);
      });
    });
  });

  //   get by id
  describe('GET /api/reviews/:review_id', () => {
    context('Given no reviews', () => {
      it('responds with 404', () => {
        const reviewId = 123456;
        return supertest(app)
          .get(`/api/reviews/${reviewId}`)
          .expect(404, { error: { message: `Review doesn't exist` } });
      });
    });

    context('Given there are reviews in the database', () => {
      const testGroups = makeGroupsArray();
      const testItems = makeItemsArray();
      const testReviews = makeReviewsArray();
      beforeEach('Insert reviews', () => {
        return db
          .into('groups')
          .insert(testGroups)
          .then(() => {
            return db.into('items').insert(testItems);
          })
          .then(() => {
            return db.into('reviews').insert(testReviews);
          });
      });
      it('responds with 200 and the specified review', () => {
        const reviewId = 2;
        const expectedPost = testReviews[reviewId - 1];
        return supertest(app)
          .get(`/api/reviews/${reviewId}`)
          .expect(200, expectedPost);
      });
    });
  });

  //   post
  describe('POST /api/reviews', () => {
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
    it('creates a review responding with 201 and the new review', () => {
      const newReview = {
        review_name: 'Name four',
        review_title: 'Title four',
        review_content: 'Content four',
        review_rating: 1,
        review_date: '2022-05-20T00:00:00.000Z',
        item_id: 1
      };
      return supertest(app)
        .post('/api/reviews')
        .send(newReview)
        .expect(201)
        .expect((res) => {
          expect(res.body.review_name).to.eql(newReview.review_name);
          expect(res.body.review_title).to.eql(newReview.review_title);
          expect(res.body.review_content).to.eql(newReview.review_content);
          expect(res.body.review_rating).to.eql(newReview.review_rating);
          expect(res.body.review_date).to.eql(newReview.review_date);
          expect(res.body.item_id).to.eql(newReview.item_id);
          expect(res.body).to.have.property('id');
          expect(res.headers.location).to.eql(`/api/reviews/${res.body.id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/reviews/${res.body.id}`).expect(res.body)
        );
    });
  });

  // delete
  describe('DELETE /api/reviews/:review_id', () => {
    context('Given there are reviews in the database', () => {
      const testGroups = makeGroupsArray();
      const testItems = makeItemsArray();
      const testReviews = makeReviewsArray();
      beforeEach('Insert reviews', () => {
        return db
          .into('groups')
          .insert(testGroups)
          .then(() => {
            return db.into('items').insert(testItems);
          })
          .then(() => {
            return db.into('reviews').insert(testReviews);
          });
      });
      it('responds with 200 and removes the review', () => {
        const idToRemove = 2;
        const expectedReviews = testReviews.filter(
          (review) => review.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/reviews/${idToRemove}`)
          .expect(200)
          .then((res) =>
            supertest(app).get('/api/reviews').expect(expectedReviews)
          );
      });
    });
  });

  //   update
  describe('PATCH /api/reviews/:review_id', () => {
    context('Given there are reviews in the database', () => {
      const testGroups = makeGroupsArray();
      const testItems = makeItemsArray();
      const testReviews = makeReviewsArray();
      beforeEach('Insert reviews', () => {
        return db
          .into('groups')
          .insert(testGroups)
          .then(() => {
            return db.into('items').insert(testItems);
          })
          .then(() => {
            return db.into('reviews').insert(testReviews);
          });
      });
      it('responds with 200 and updates the review', () => {
        const idToUpdate = 2;
        const updateReview = {
          review_name: 'Name new',
          review_title: 'Title new',
          review_content: 'Content new',
          review_rating: 1,
          review_date: '2023-05-21T00:00:00.000Z'
        };
        const expectedReview = {
          ...testReviews[idToUpdate - 1],
          ...updateReview
        };
        return supertest(app)
          .patch(`/api/reviews/${idToUpdate}`)
          .send(updateReview)
          .expect(200)
          .then((res) =>
            supertest(app)
              .get(`/api/reviews/${idToUpdate}`)
              .expect(expectedReview)
          );
      });
    });
  });
});
