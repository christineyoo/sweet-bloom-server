const ItemsService = {
    getAllItems(knex) {
      return knex('items').select('*');
    },
    getById(knex, id) {
      return knex('items').select('*').where({ id }).first();
    }
  };
  
  module.exports = ItemsService;