var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test the favorites endpoints', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');
    // anything else you need to do
    fetch.resetMocks(); // reset all mocking you've set up
  });
  describe('POST /api/v1/favorites', () => {
    it('happy path', async () => {
      // set a mock object and stub the fetch call to return a custom object
      // so your fetch call always returns exactly what you want it to return
      await fetch.mockResponseOnce(
        JSON.stringify({
          message: {
            body: {
              track: {
                artist_name: "Queen",
                track_name: "We Will Rock You",
                track_rating: 88,
                primary_genres: {
                  music_genre_list: [{
                    music_genre: {
                      music_genre_name: "Awesome Rock"
                    }
                  }]
                }
              }
            }
          }
        })
      );
      const res = await request(app)
        .post("/api/v1/favorites")
        .send({
          title: "we will rock You",
          artistName: "Queen"
        })
        expect(res.statusCode).toEqual(201);
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
    
    it('sad path, musixmatch does not return an integer rating', async () => {
      await fetch.mockResponseOnce(
        JSON.stringify({
          message: {
            body: {
              track: {
                artist_name: "Queen",
                track_name: "We Will Rock You",
                track_rating: "this song is great",
                primary_genres: {
                  music_genre_list: [{
                    music_genre: {
                      music_genre_name: "Awesome Rock"
                    }
                  }]
                }
              }
            }
          }
        })
      );
      const res = await request(app)
        .post("/api/v1/favorites")
        .send({
          title: "We Will Rock You",
          artistName: "Queen" }
      );
      expect(fetch.mock.calls.length).toEqual(1);
      expect(res.statusCode).toBe(503);
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toBe("Musixmatch returned a rating that was not an integer");
    });
  })
});
