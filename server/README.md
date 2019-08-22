# Amazon Price Checker Nodejs API server

## Items Endpoints

### Get All Items in Database

```
GET - http://localhost:3000/api/get-all-product-data
```

### Get All Followed Items in Database

```
GET - http://localhost:3000//api/get-all-followed-items
```

### Retreives a single item from the database

```
POST - http://localhost:3000/api/fetch-single-item
Body:
{
  "id":"single object _id"
}
```

### Get all the items from a single user

```
POST - http://localhost:3000/api/get-single-user-items
Body:
{
  "userId":"user._id"
}
```

### Launches the server to scrape the item and add it to the database

```
POST - http://localhost:3000/api/initial-add-product
Body:
{
  "userId": "user._id",
  "url": "amazon url",
  "follow": boolean,
  "targetPrice": number
}
```

### Launches the scraper to check the price of an item

```
POST - http://localhost:3000/api/update-scraped-item
Body:
{
  "id": "single object _id",
  "targetPrice": number
}
```

### Updates the following status of an item

```
POST - http://localhost:3000/api/update-scraped-following
Body:
{
  "id": "single object _id",
  "follow": "boolean"
}
```

### Removes the item from the items database, and adds it to a deleted collection

```
POST - http://localhost:3000/api/remove-scraped-item
Body:
{
  "userId": "user._id",
  "itemId":"single object _id"
}
```

## User Endpoints

### Gets all the users in the DB

```
GET - http://localhost:3000/api/users
```

### Create a new user

```
POST - http://localhost:3000/user/create
Body:
{
  "name": "Users name",
  "email": "Users email",
  "password": "Users password"
}
```

### Login a user

```
POST - http://localhost:3000/user/login
Body:
  {
    "email": "Users email",
    "password": "Users password"
  }
```
