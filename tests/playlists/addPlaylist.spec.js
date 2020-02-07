var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test the get playlists endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade')
  });
  afterEach(async () => {
    await database.raw('truncate table playlists cascade');
  });
  describe('POST /api/v1/playlists', () => {
    it('happy path', async () => {
      const res = await request(app)
        .post('/api/v1/playlists')
        .send({
          title: "Roadtrip!!!",
        })

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("title");
        expect(res.body.title).toBe("Roadtrip!!!");
        expect(res.body).toHaveProperty("createdAt");
        expect(res.body).toHaveProperty("updatedAt");
    });
  })
  it('sad path, must have a title', async () => {

    const res = await request(app)
      .post('/api/v1/playlists')
      .send();

    expect(res.statusCode).toBe(422);
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toBe("Playlist not created, please enter a title.");
  });

    it('sad path, must have unique title', async () => {
      let playlist_1 = {
        title: 'Roadtrip!!!'
      };
      await database('playlists').insert(playlist_1);

      const res = await request(app)
        .post('/api/v1/playlists')
        .send({
          title: "Roadtrip!!!",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toBe("Title must be unique!");
    });
  });
