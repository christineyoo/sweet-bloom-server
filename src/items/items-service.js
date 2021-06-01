const ItemsService = {
    getAllItems(knex) {
      return knex('items').select('*');
    }
  };
  
  module.exports = ItemsService;