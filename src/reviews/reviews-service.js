const ReviewsService = {
  getAllReviews(knex) {
    return knex('reviews').select('*');
  },
  insertReview(knex, newReview) {
    return knex('reviews')
      .insert(newReview)
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex('reviews').select('*').where({ id }).first();
  },
  deleteReview(knex, id) {
    return knex('reviews').where({ id }).delete();
  },
  updateReview(knex, id, newReviewFields) {
    return knex('reviews').where({ id }).update(newReviewFields);
  }
};

module.exports = ReviewsService;
