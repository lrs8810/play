var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test it can add favorites to playlists_favorites endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists_favorites cascade')
  });
  afterEach(async () => {
    await database.raw('truncate table playlists_favorites cascade');
  });

  describe('POST /api/v1/playlists/:id/favorites/:id', () => {
    it('happy path', async () => {
      let playlist = {
        id: 1,
        title: 'Roadtrip'
      }

      let favorite_1 = {
        title: "We Will Rock You",
        artistName: "Queen",
        genre: "Awesome Rock",
        rating: 80
      }
      let favorite_2 = {
        title: "You Shook Me All Night Long",
        artistName: "ACDC",
        genre: "Rock",
        rating: 75
      }
      await database('playlists').insert(playlist)
      await database('favorites').insert(favorite_1)
      await database('favorites').insert(favorite_2)
      const res = await request(app)
        .post('/api/v1/playlists/1/favorites/7')
        .send({})

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('Success')
      expect(res.body.success).toBe(`${favorite_1.title} has been added to ${playlist.title}!`)
    })
  })
})
