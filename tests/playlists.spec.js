var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test the add playlist endpoint', () => {
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

describe('Test the get playlists endpoint', () => {
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

  describe('GET /api/v1/playlists', () => {
   it('happy path', async () => {
     let playlist_1 = {
       id: 10,
       title: 'Roadtrip!!!'
     };
     let playlist_2 = {
       id: 20,
       title: 'Study!!!'
     };
     let favorite_1 = {
       id: 45,
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
     let playlistFavorite_1 = {
       playlist_id: 10,
       favorite_id: 45
     }
     let playlistFavorite_2 = {
       playlist_id: 10,
       favorite_id: 49
     }

     await database('playlists').insert(playlist_1);
     await database('playlists').insert(playlist_2);
     await database('favorites').insert(favorite_1);
     await database('favorites').insert(favorite_2);
     await database('playlists_favorites').insert(playlistFavorite_1);
     await database('playlists_favorites').insert(playlistFavorite_2);

     const res = await request(app)
       .get("/api/v1/playlists")

       expect(res.statusCode).toEqual(200);
       expect(res.body.length).toEqual(2);
       expect(res.body[0]).toHaveProperty("id");
       expect(res.body[0]).toHaveProperty("title");
       expect(res.body[0]).toHaveProperty("songCount");
       expect(res.body[0]).toHaveProperty("songAvgRating");
       expect(res.body[0]).toHaveProperty("createdAt");
       expect(res.body[0]).toHaveProperty("updatedAt");
       expect(res.body[0].title).toBe("Roadtrip!!!");
       expect(res.body[0].songCount).toBe(2);
       expect(res.body[0]).toHaveProperty("favorites");
       expect(res.body[0].favorites.length).toEqual(2);
       expect(res.body[0].favorites[0].title).toBe("Bohemian Rhapsody");
       expect(res.body[0].favorites[0].artistName).toBe("Queen");
       expect(res.body[0].favorites[0].genre).toBe("Awesome Rock");
       expect(res.body[0].favorites[0].rating).toBe(80);
       expect(res.body[0].favorites[1].title).toBe("You Shook Me All Night Long");
       expect(res.body[0].favorites[1].artistName).toBe("ACDC");
       expect(res.body[0].favorites[1].genre).toBe("Rock");
       expect(res.body[0].favorites[1].rating).toBe(75);
       expect(res.body[1].favorites.length).toEqual(0);

   })
 });
});

describe('Test the delete playlist endpoint', () => {
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

    it('sad path, will return 404 if playlist is not found', async () => {
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
    });
  });
});

describe('Test the update playlist endpoint', () => {
  beforeEach(async () => {
    await database.raw('truncate table playlists cascade');

    let playlist = {
      id: 4,
      title: 'Pump up Jamz'
    };
    let playlist_2 = {
      title: 'Study'
    };
    await database('playlists').insert(playlist);
    await database('playlists').insert(playlist_2);
  });

  afterEach(() => {
    database.raw('truncate table playlists cascade');
  });

  describe('PUT /api/v1/playlists/:id', () => {
    it('happy path', async () => {
      const res = await request(app)
        .put("/api/v1/playlists/4")
        .send({
          title: "Workout Jamz",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("id");
      expect(res.body.id).toBe(4);
      expect(res.body).toHaveProperty("title");
      expect(res.body.title).toBe("Workout Jamz");
      expect(res.body).toHaveProperty("createdAt");
      expect(res.body).toHaveProperty("updatedAt");
    });
  });

    it('sad path, will return 404 if playlist is not found', async () => {
      const res = await request(app)
        .put("/api/v1/playlists/700")
        .send({
          title: "Workout Jamz",
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Could not find playlist with id 700");
    });

    it('sad path, will return 400 if :id is anything other than an integer', async () => {
      const res = await request(app)
        .put("/api/v1/playlists/bob")
        .send({
          title: "Workout Jamz",
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Please send a valid integer as the id parameter.");
    });

    it('sad path, will return 422 if title is not sent in request', async () => {
      const res = await request(app)
        .put("/api/v1/playlists/4")
        .send({})

      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Playlist not updated, please enter a title.");
    });

    it('sad path, will return 409 if title is not unique', async () => {
      const res = await request(app)
        .put("/api/v1/playlists/4")
        .send({
          title: "Study"
        })

      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toBe("Title must be unique!");
    });
});
