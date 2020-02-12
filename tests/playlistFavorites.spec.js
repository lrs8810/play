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
