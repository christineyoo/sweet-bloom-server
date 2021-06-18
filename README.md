# Sweet-Bloom-Server
## Description
This is the server-side code for the groups, items, and reviews of the [client-side Sweet Bloom app](https://sweet-bloom.vercel.app/)
- [GitHub Repo for Sweet Bloom (client-side)](https://github.com/christineyoo/sweet-bloom)

## Features
### Groups table
- The `groups` table stores the data about the "Flowers" and "Desserts" groups
- [Click here see the 'groups' data](https://christine-sweetbloom.herokuapp.com/api/groups)

### Items table
- The `items` table stores the data about each item. Each item has an id, name, price, description, image url, and group id. Each item references a group.
- [Click here see the 'items' data](https://christine-sweetbloom.herokuapp.com/api/items)

### Reviews table
- The `reviews` table stores the data about each review. Each review has an id, name, title, content, rating, date, and item id. Each review references an item.
- [Click here see the 'reviews' data](https://christine-sweetbloom.herokuapp.com/api/reviews)

#### ER Diagram
![image](https://user-images.githubusercontent.com/76637034/122489235-06bb9c00-cf94-11eb-876c-f7ea503b407e.png)

## API Documentation
``` 
/api
.
|---/groups
|     |-- GET
|---/items
|     |-- GET
|     |-- GET /:item_id
|---/reviews
|     |-- GET
|     |-- GET /:review_id
|     |-- POST
|     |-- PATCH /:review_id
|     |-- DELETE /:review_id
```

### GET `/api/groups`
```
// res.body
{
  id: integer,
  group_name: text
}
```

### GET `/api/items` and GET `/api/items/:item_id`
```
// res.body
{
  id: integer,
  item_name: text,
  item_price: integer,
  item_url: text,
  item_description: text,
  group_id: integer
}
```

### GET `/api/reviews` and GET `/api/reviews/:review_id`
```
// res.body
{
  id: integer,
  review_name: text,
  item_id: integer,
  review_title: text,
  review_content: text,
  review_rating: integer,
  review_date: timestamptz
}
```

### POST `/api/reviews`
```
// req.body
{
  review_name: text,
  item_id: integer,
  review_title: text,
  review_content: text,
  review_rating: integer,
  review_date: timestamptz
}
```

### PATCH `/api/reviews/:review_id`
```
// req.body
{
  review_name: text,
  item_id: integer,
  review_title: text,
  review_content: text,
  review_rating: integer,
  review_date: timestamptz
}
```

## Technologies used
- Node.js
- Express, Express Router
- Knex
- SQL
- PostgreSQL
- Testing with Mocha, Chai, and Supertest
- Heroku
