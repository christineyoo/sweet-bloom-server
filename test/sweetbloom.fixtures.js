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

function makeReviewsArray() {
  return [
    {
      id: 1,
      review_name: 'Name one',
      review_title: 'Title one',
      review_content: 'Content one',
      review_rating: 1,
      review_date: '2021-05-20T00:00:00.000Z',
      item_id: 1
    },
    {
      id: 2,
      review_name: 'Name two',
      review_title: 'Title two',
      review_content: 'Content two',
      review_rating: 2,
      review_date: '2021-05-20T00:00:00.000Z',
      item_id: 2
    },
    {
      id: 3,
      review_name: 'Name three',
      review_title: 'Title three',
      review_content: 'Content three',
      review_rating: 3,
      review_date: '2021-05-20T00:00:00.000Z',
      item_id: 3
    }
  ];
}

module.exports = {
  makeGroupsArray,
  makeItemsArray,
  makeReviewsArray
};
