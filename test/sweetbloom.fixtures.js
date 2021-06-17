function makeGroupsArray() {
  return [
    {
      id: 1,
      group_name: 'Group A'
    },
    {
      id: 2,
      group_name: 'Group B'
    }
  ];
}

function makeItemsArray() {
  return [
    {
      id: 1,
      item_name: 'Name one',
      item_price: 10,
      item_url: 'Url one',
      item_description: 'Description one',
      group_id: 1
    },
    {
      id: 2,
      item_name: 'Name two',
      item_price: 20,
      item_url: 'Url two',
      item_description: 'Description two',
      group_id: 2
    },
    {
      id: 3,
      item_name: 'Name three',
      item_price: 30,
      item_url: 'Url three',
      item_description: 'Description three',
      group_id: 1
    }
  ];
}

module.exports = {
  makeGroupsArray,
  makeItemsArray
};
