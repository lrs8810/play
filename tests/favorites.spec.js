var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test the add favorite endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade');

    fetch.resetMocks();
  });
  describe('POST /api/v1/favorites', () => {
    it('happy path', async () => {

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
  });
});

describe('Test the get favorites endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table favorites cascade')
  });
  afterEach(async () => {
    await database.raw('truncate table favorites cascade');
  });
  describe('GET /api/v1/favorites', () => {
   it('happy path', async () => {
     let favorite_1 = {
       title: 'We Will Rock You',
       artistName: 'Queen',
       genre: 'Awesome Rock',
       rating: 88
     };
     let favorite_2 = {
       title: 'You Shook Me All Night Long',
       artistName: 'ACDC',
       genre: 'Awesome Rock',
       rating: 75
     };
     let favorite_3 = {
       title: 'Bohemian Rhapsody',
       artistName: 'Queen',
       genre: 'Rock',
       rating: 99
     };
     await database('favorites').insert(favorite_1);
     await database('favorites').insert(favorite_2);
     await database('favorites').insert(favorite_3);

     const res = await request(app)
       .get("/api/v1/favorites")

       expect(res.statusCode).toEqual(200);
       expect(res.body.length).toEqual(3);
       expect(res.body[0]).toHaveProperty("id");
       expect(res.body[0]).toHaveProperty("title");
       expect(res.body[0].title).toBe("We Will Rock You");
       expect(res.body[2]).toHaveProperty("artistName");
       expect(res.body[2].artistName).toBe("Queen");
       expect(res.body[2]).toHaveProperty("genre");
       expect(res.body[2].genre).toBe("Rock");
       expect(res.body[1]).toHaveProperty("rating");
       expect(res.body[1].rating).toBe(75);
   })

   describe('Test the sad path for get favorites endpoint', () => {
    it('will return 200 if no favorites', async () => {
     const res = await request(app)
       .get("/api/v1/favorites")

       expect(res.statusCode).toEqual(200);
       expect(res.body.length).toEqual(0);
    });
  });
 });
});

describe('Test the get specific favorite endpoint', () => {
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
    database.raw('truncate table favorites cascade');
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

    it('sad path, will return 500 if :id is anything other than an integer', async () => {
      const res = await request(app)
        .get("/api/v1/favorites/start")
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("error");
    });
  });
});

describe('Test the delete favorite endpoint', () => {
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
    database.raw('truncate table favorites cascade');
  });

  describe('DELETE /api/v1/favorites/:id', () => {
    it('happy path', async () => {
      const res = await request(app)
        .delete("/api/v1/favorites/1")
        expect(res.statusCode).toEqual(204);
    });

    it('sad path, will return 404 if favorite is not found', async () => {
      const res = await request(app)
        .delete("/api/v1/favorites/30")
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toBe("Could not find favorite with id 30");
    });

    it('sad path, will return 500 if :id is anything other than an integer', async () => {
      const res = await request(app)
        .delete("/api/v1/favorites/start")
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty("error");
    });
  });
});
