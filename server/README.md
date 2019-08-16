# Amazon Price Checker Nodejs API server

## Endpoints

### Get All Items in Database

```
GET - http://localhost:3000/api/get-all-product-data
```

### Retreives a single item from the database

```
POST - http://localhost:3000/api/fetch-single-item
Body:
{
  "id":"single object _id"
}
```

### Launches the server to scrape the item and add it to the database

```
POST - http://localhost:3000/api/initial-add-product
Body:
{
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

### Removes the item from the items database, and adds it to a deleted collection

```
POST - http://localhost:3000/api/remove-scraped-item
Body:
{
  "id":"single object _id"
}
```
