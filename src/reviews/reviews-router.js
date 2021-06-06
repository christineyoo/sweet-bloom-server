const express = require('express');
const path = require('path');
const ReviewsService = require('./reviews-service');
const xss = require('xss');

const reviewsRouter = express.Router();
const jsonParser = express.json();

const serializeReview = (review) => ({
  id: review.id,
  review_name: xss(review.review_name),
  item_id: review.item_id,
  review_title: xss(review.review_title),
  review_content: xss(review.review_content),
  review_rating: review.review_rating,
  review_date: review.review_date
});

reviewsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    ReviewsService.getAllReviews(knexInstance)
      .then((reviews) => {
        res.json(reviews.map(serializeReview));
      })
      .catch((err) => {
        // helps with logging errors rather than generic 500 status
        console.log({ err });
        next();
      });
  })
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {
      review_name,
      item_id,
      review_title,
      review_content,
      review_rating,
      review_date
    } = req.body;
    const newReview = {
      review_name,
      item_id,
      review_title,
      review_content,
      review_rating
    };

    for (const [key, value] of Object.entries(newReview)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    newReview.review_date = review_date;

    ReviewsService.insertReview(knexInstance, newReview)
      .then((review) => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${review.id}`))
          .json(serializeReview(review));
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  });

reviewsRouter
  .route('/:review_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    ReviewsService.getById(knexInstance, req.params.review_id)
      .then((review) => {
        if (!review) {
          return res
            .status(404)
            .json({ error: { message: `Review doesn't exist` } });
        }
        res.review = review;
        next();
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  })
  .get((req, res, next) => {
    res.json(serializeReview(res.review));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    ReviewsService.deleteReview(knexInstance, req.params.review_id)
      .then((numRowsAffected) => {
        res.json({ message: `Successfully deleted` });
        res.status(204).end();
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {
      review_name,
      review_title,
      review_content,
      review_rating,
      review_date
    } = req.body;
    const reviewToUpdate = {
      review_name,
      review_title,
      review_content,
      review_rating,
      review_date
    };

    const numberOfValues = Object.values(reviewToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'review_name', 'review_title', 'review_content', 'review_rating', or 'review_date'`
        }
      });

    ReviewsService.updateReview(
      knexInstance,
      req.params.review_id,
      reviewToUpdate
    )
      .then((numRowsAffected) => {
        res.json({ message: `Successfully updated` });
        res.status(204).end();
      })
      .catch((err) => {
        console.log({ err });
        next();
      });
  });

module.exports = reviewsRouter;
