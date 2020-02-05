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
      expect(res.body.error).toBe("Musixmatch returned a rating that was not an accepted integer");
    });

    it('sad path, will return 422 error if property is not sent in request', async () => {
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
          artistName: "Queen" }
      );
      expect(res.statusCode).toBe(422);
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toBe(`Expected format: { artistName: <String>, title: <String> }. You're missing a \"title\" property.`);
    });

    it('sad path, will return 400 error if favorite is not created', async () => {
      await fetch.mockResponseOnce(
        JSON.stringify({
          message: {
          header: {
              status_code: 404,
              execute_time: 0.25364995002747,
              mode: "search",
              cached: 0
          },
          body: ""
          }
        })
      );
      const res = await request(app)
        .post("/api/v1/favorites")
        .send({
          title: "ABCDEFG",
          artistName: "Queen" }
      );
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error')
      expect(res.body.error).toBe("Favorite cannot be created");
    });

    it('sad path, musixmatch does not return an integer rating greater than 100', async () => {
      await fetch.mockResponseOnce(
        JSON.stringify({
          message: {
            body: {
              track: {
                artist_name: "Queen",
                track_name: "We Will Rock You",
                track_rating: 200,
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
      expect(res.body.error).toBe("Musixmatch returned a rating that was not an accepted integer");
    });
  })
});
