# Play

## Introduction

Play is an Express API which allows users to hit eleven endpoints. Those endpoints include adding favorite songs, listing all favorited songs, finding a specific favorite and deleting a favorited song.

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

#### How to run tests
Testing is setup using Jest, which can be configured in the `package.json` file and run using the commands:

`knex migrate:latest --env test`

`npm test`

#### API Keys

To get started with the API calls you will need an API key for both [Musixmatch API](https://developer.musixmatch.com/).

This project also utilizes [Dotenv](https://github.com/motdotla/dotenv) for storing those keys so you simply need to create a `.env` file in your root directory and add your API keys using the syntax:

`MUSIXMATCH_API_KEY=<YOUR-API-KEY>`

#### Database Schema
This project's database is set up with three tables.
- Favorites: will take a `title`, `artistName`, `genre` and `rating`
- Playlists: will take a `title`
- Playlists_favorites: will set up a many to many relationship between Favorites and Playlists using the `favorite_id` and `playlist_id`

![](https://i.imgur.com/WAmIwhM.png)


## Endpoints
The domain for this Express API is `https://play-express.herokuapp.com/`<br>
All endpoints are public and do not require an API key. <br>
Below is a list of all available endpoints by resource. Click on the link for instructions on what needs to be sent in the request and examples of successful responses.

###### Favorites endpoints:
- [Add a favorite song](#add-a-favorite-song)
- [Show all favorites](#show-all-favorites)
- [Show a specific favorite](#show-a-specific-favorite)
- [Delete a specific favorite](#delete-a-specific-favorite)

###### Playlists endpoints:
- [Add a playlist](#add-a-playlist)
- [Show all playlists](#show-all-playlists)
- [Update a specific playlist](#show-all-playlists)
- [Delete a specific playlist](#show-all-playlists)
- [Add a favorite to a specific playlist](#add-a-favorite-to-a-specific-playlist)
- [Show all favorites related to a specific playlist](#show-all-favorites-related-to-a-specific-playlist)
- [Delete a favorite from a specific playlist](#delete-a-favorite-from-a-specifc-playlist)


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

#### Add a playlist
###### Request
```
POST /api/v1/playlists
```
Send the `title` in the body of the request as shown below. Only unique `titles` will be added.
```
{ title: "Cleaning House" }
```
###### Successful Response
```
Status code: 201

{
  "id": 1,
  "title": "Cleaning House",
  "createdAt": 2019-11-26T16:03:43+00:00,
  "updatedAt": 2019-11-26T16:03:43+00:00,
}
```

#### Show all playlists
###### Request
```
GET /api/v1/playlists
```
###### Successful Response
If there are playlists saved in the database you can expect to receive a similar response.
```
Status code: 200

[
  {
    "id": 1,
    "title": "Cleaning House",
    "songCount": 2,
    "songAvgRating": 27.5,
    "favorites": [
                    {
                      "id": 1,
                      "title": "We Will Rock You",
                      "artistName": "Queen"
                      "genre": "Rock",
                      "rating": 25
                    },
                    {
                      "id": 4,
                      "title": "Back In Black",
                      "artistName": "AC/DC"
                      "genre": "Rock",
                      "rating": 30
                    }
                  ],
    "createdAt": "2019-11-26T16:03:43+00:00",
    "updatedAt": "2019-11-26T16:03:43+00:00"
  },
  {
    "id": 2,
    "title": "Running Mix",
    "songCount": 0,
    "songAvgRating": 0,
    "favorites": []
    "createdAt": "2019-11-26T16:03:43+00:00",
    "updatedAt": "2019-11-26T16:03:43+00:00"
  },
]
```
If there are no playlists saved in the database you can expect to receive an empty array.
```
Status code: 200

[]
```
#### Update a specific playlist
###### Request
Send the playlist ID as a parameter. Only integers greater than 0 are acceptable.
```
PUT /api/v1/playlists/:id
```
###### Successful Response
```
Status code: 200

{
  "id": 2,
  "title": "Marathon Running Mix",
  "createdAt": 2019-11-26T16:03:43+00:00,
  "updatedAt": 2019-11-26T16:03:43+00:00
}
```

#### Delete a specific playlist
###### Request
Send the playlist ID as a parameter. Only integers greater than 0 are acceptable.
```
DELETE /api/v1/playlists/:id
```
###### Successful Response
```
Status code: 204
```
#### Add a favorite to a specific playlist
###### Request
Send the playlist ID and favorite ID as parameters. Only integers greater than 0 are acceptable.
```
 POST /api/v1/playlists/:id/favorites/:id
```
###### Successful Response
```
Status code: 201

{  "Success": "{Song Title} has been added to {Playlist Title}!" }
```
#### Show all favorites related to a specific playlist
###### Request
Send the playlist ID as a parameter. Only integers greater than 0 are acceptable.
```
 GET /api/v1/playlists/:id/favorites
```
###### Successful Response
```
Status code: 200

{
  "id": 1,
  "title": "Cleaning House",
  "songCount": 2,
  "songAvgRating": 27.5,
  "favorites" : [
                  {
                    "id": 1,
                    "title": "We Will Rock You",
                    "artistName": "Queen"
                    "genre": "Rock",
                    "rating": 25
                  },
                  {
                    "id": 4,
                    "title": "Back In Black",
                    "artistName": "AC/DC"
                    "genre": "Rock",
                    "rating": 30
                  }
               ],
    "createdAt": "2019-11-26T16:03:43+00:00",
    "updatedAt": "2019-11-26T16:03:43+00:00"
}
```
#### Delete a favorite from a specific playlist
###### Request
Send the playlist ID and favorite ID as parameters. Only integers greater than 0 are acceptable.
```
DELETE /api/v1/playlists/:id/favorites/:id
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
