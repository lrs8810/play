# Play

## Introduction

Play is an Express API which allows users to hit four endpoints. Those endpoints include adding favorite songs, listing all favorited songs, finding a specific favorite and deleting a favorited song.

## Getting Started

#### Installing necessary dependencies

The easiest way to get started is to fork this repo, `cd` into the root directory and run the following command. This will pull down any necessary dependencies that your app will require.

`npm install`

#### Set up your local database

To get things set up, you’ll need to access a Postgres database. This project currently uses a database called `play_dev` but that can be configured in `knexfile.js`.

#### Migrations
Once you have your database setup, you’ll need to run some migrations. You can do this by running the following command:

`knex migrate:latest`

#### Seeds
Once you have your migrations setup, you'll need to seed your database. You can do this by running the following command:

`knex seed:run`

#### API Keys

To get started with the API calls you will need an API key for both [Musixmatch API](https://developer.musixmatch.com/).

This project also utilizes [Dotenv](https://github.com/motdotla/dotenv) for storing those keys so you simply need to create a `.env` file in your root directory and add your API keys using the syntax:

`MUSIXMATCH_API_KEY=<YOUR-API-KEY>`


## Endpoints
The domain for this Express API is `https://play-express.herokuapp.com/`<br>
All endpoints are public and do not require an API key. <br>
Below is a list of all available endpoints by resource. Click on the link for instructions on what needs to be sent in the request and examples of successful responses.

###### Favorite resources:
- [Add a favorite song](####add-a-favorite-song)
- [Show all favorites](####show-all-favorites)
- [Show a specific favorite](####show-a-specific-favorite)
- [Delete a specific favorite](####delete-a-specific-favorite)

#### Add a favorite song
###### Request
```
POST /api/v1/favorites
```
Send the `title` and `artistName` in the body of the request as shown below.
```
{ title: "We Will Rock You",artistName: "Queen" }
```
###### Successful Response
```
Status code: 201

{
  "id": 1,
  "title": "We Will Rock You",
  "artistName": "Queen"
  "genre": "Rock",
  "rating": 88
}
```

#### Show all favorites
###### Request
```
GET /api/v1/favorites

```
###### Successful Response
If there are favorites saved in the database you can expect to receive a similar response.
```
Status code: 200

[
  {
    "id": 1,
    "title": "We Will Rock You",
    "artistName": "Queen"
    "genre": "Rock",
    "rating": 88
  },
  {
    "id": 2,
    "title": "Careless Whisper",
    "artistName": "George Michael"
    "genre": "Pop",
    "rating": 93
  },
]
```
If there are no favorites saved in the database you can expect to receive an empty array.
```
Status code: 200

[]
```
#### Show a specific favorite
###### Request
Send the favorite ID as a parameter. Only integers greater than 0 are acceptable.
```
GET /api/v1/favorites/:id
```
###### Successful Response
```
Status code: 200

{
  "id": 1,
  "title": "We Will Rock You",
  "artistName": "Queen"
  "genre": "Rock",
  "rating": 88
}
```

#### Delete a specific favorite
###### Request
Send the favorite ID as a parameter. Only integers greater than 0 are acceptable.
```
DELETE /api/v1/favorites/:id
```
###### Successful Response
```
Status code: 204
```

## Tech Stack

- JavaScript
- Node.js
- Express
- Knex
- PostgreSQL

## Core Contributors

[Laura Schulz](https://github.com/lrs8810)
[Zac Isaacson](https://github.com/zacisaacson)
