var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test the playlist endpoints', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    let playlist = {
      id: 1,
      title: 'Roadtrip!!'
    };
    await database('playlists').insert(playlist);
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });

  describe('DELETE /api/v1/playlists/:id', () => {
    it('happy path', async () => {
      const res = await request(app)
        .delete("/api/v1/playlists/1")
        expect(res.statusCode).toEqual(204);
    });

    it('sad path, will return 404 if favorite is not found', async () => {
      const res = await request(app)
        .delete("/api/v1/playlists/700")
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Could not find playlist with id 700");
    });

    it('sad path, will return 500 if :id is anything other than an integer', async () => {
      const res = await request(app)
        .delete("/api/v1/playlists/start")
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("error");
    });
  })
})
