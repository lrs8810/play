var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test it can add favorites to playlists_favorites endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists_favorites cascade')
    await database.raw('truncate table playlists cascade')
    await database.raw('truncate table favorites cascade')
  });
  afterEach(async () => {
    await database.raw('truncate table playlists_favorites cascade');
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorites cascade');
  });

  describe('POST /api/v1/playlists/:id/favorites/:id', () => {
    it('happy path', async () => {
      let playlist = {
        id: 5,
        title: 'Roadtrip'
      }

      let favorite_1 = {
        id: 75,
        title: "Bohemian Rhapsody",
        artistName: "Queen",
        genre: "Awesome Rock",
        rating: 80
      }
      let favorite_2 = {
        id: 80,
        title: "You Shook Me All Night Long",
        artistName: "ACDC",
        genre: "Rock",
        rating: 75
      }
      await database('playlists').insert(playlist)
      await database('favorites').insert(favorite_1)
      await database('favorites').insert(favorite_2)
      const res = await request(app)
        .post('/api/v1/playlists/5/favorites/75')

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('Success')
      expect(res.body.Success).toBe(`${favorite_1.title} has been added to ${playlist.title}!`)
    })
  })
})

describe('Test it can get all favorites for a playlist with playlists_favorites endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists_favorites cascade')
    await database.raw('truncate table playlists cascade')
    await database.raw('truncate table favorites cascade')
  });
  afterEach(async () => {
    await database.raw('truncate table playlists_favorites cascade');
    await database.raw('truncate table playlists cascade');
    await database.raw('truncate table favorites cascade');
  });

  describe('GET /api/v1/playlists/:id/favorites', () => {
    it('happy path', async () => {
      let playlist = {
        id: 9,
        title: 'Roadtrip'
      }
      let favorite_1 = {
        id: 30,
        title: "Bohemian Rhapsody",
        artistName: "Queen",
        genre: "Awesome Rock",
        rating: 80
      }
      let favorite_2 = {
        id: 49,
        title: "You Shook Me All Night Long",
        artistName: "ACDC",
        genre: "Rock",
        rating: 75
      }
      let favorite_3 = {
        id: 50,
        title: "New Song",
        artistName: "ACDC",
        genre: "Rock",
        rating: 75
      }
      let playlistFavorite_1 = {
        playlist_id: 9,
        favorite_id: 30
      }
      let playlistFavorite_2 = {
        playlist_id: 9,
        favorite_id: 49
      }
      await database('playlists').insert(playlist)
      await database('favorites').insert(favorite_1)
      await database('favorites').insert(favorite_2)
      await database('favorites').insert(favorite_3)
      await database('playlists_favorites').insert(playlistFavorite_1)
      await database('playlists_favorites').insert(playlistFavorite_2)

      const res = await request(app)
        .get('/api/v1/playlists/9/favorites')

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("songCount");
      expect(res.body.songCount).toBe(2);
      expect(res.body).toHaveProperty("songAvgRating");
      expect(res.body.songAvgRating).toBe(77.5);
      expect(res.body).toHaveProperty("favorites");
      expect(res.body.favorites.length).toBe(2);
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");
    })
  })
})

describe('Test the delete playlist endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    let playlist = {
      id: 1,
      title: 'Roadtrip!!'
    };
    let favorite_1 = {
      id: 45,
      title: "Bohemian Rhapsody",
      artistName: "Queen",
      genre: "Awesome Rock",
      rating: 80
    };
    let favorite_2 = {
      id: 49,
      title: "You Shook Me All Night Long",
      artistName: "ACDC",
      genre: "Rock",
      rating: 75
    }
    let playlistFavorite_1 = {
      playlist_id: 1,
      favorite_id: 45
    }
    await database('playlists').insert(playlist);
    await database('favorites').insert(favorite_1);
    await database('favorites').insert(favorite_2);
    await database('playlists_favorites').insert(playlistFavorite_1);
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });

  describe('DELETE /api/v1/playlists/:id/favorites/:id', () => {
    it('happy path', async () => {
      const res = await request(app)
        .delete("/api/v1/playlists/1/favorites/45")
        expect(res.statusCode).toEqual(204);
    });
  });
});
