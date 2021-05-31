const GroupsService = {
  getAllGroups(knex) {
    return knex('groups').select('*');
  }
};

module.exports = GroupsService;
