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

Add a favorite song:

```
Post /api/v1/favorites

Body:

{
 title: "We Will Rock You",
 artistName: "Queen"
}
```

Listing all favorites:

```
GET /api/v1/favorites

```

List a specific favorite:

```
GET /api/v1/favorites/:id

```

Deleting an existing favorite:

```
DELETE /api/v1/favorites/:id

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
