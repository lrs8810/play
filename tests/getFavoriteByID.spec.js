var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test the favorites endpoints', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');

    let favorite = {
      id: 1,
      title: 'We Will Rock You',
      artistName: 'Queen',
      genre: 'Awesome Rock',
      rating: 88
    };
    await database('favorites').insert(favorite);
  });

  afterEach(() => {
    database.raw('truncate table papers cascade');
  });

  describe('GET /api/v1/favorites/:id', () => {
    it('happy path', async () => {
      const res = await request(app)
        .get("/api/v1/favorites/1")
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("title");
        expect(res.body.title).toBe("We Will Rock You");
        expect(res.body).toHaveProperty("artistName");
        expect(res.body.artistName).toBe("Queen");
        expect(res.body).toHaveProperty("genre");
        expect(res.body.genre).toBe("Awesome Rock");
        expect(res.body).toHaveProperty("rating");
        expect(res.body.rating).toBe(88);
    });

    it('sad path, will return 404 if favorite is not found', async () => {
      const res = await request(app)
        .get("/api/v1/favorites/30")
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Could not find favorite with id 30");
    });
    
