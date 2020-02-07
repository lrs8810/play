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

  describe('GET /api/v1/playlists', () => {
   it('happy path', async () => {
     let playlist_1 = {
       title: 'Roadtrip!!!'
     };
     let playlist_2 = {
       title: 'Study'
     };
     let playlist_3 = {
       title: 'Lo-Fi'
     };

     await database('playlists').insert(playlist_1);
     await database('playlists').insert(playlist_2);
     await database('playlists').insert(playlist_3);

     const res = await request(app)
       .get("/api/v1/playlists")

       expect(res.statusCode).toEqual(200);
       expect(res.body.length).toEqual(3);
       expect(res.body[0]).toHaveProperty("id");
       expect(res.body[0]).toHaveProperty("title");
       expect(res.body[0].title).toBe("Roadtrip!!!");
       expect(res.body[2]).toHaveProperty("createdAt");
       expect(res.body[2]).toHaveProperty("updatedAt");
       expect(res.body[2].title).toBe("Lo-Fi");
   })
   describe('sad path for get playlists endpoint', () => {
    it('will return 200 if no playlists', async () => {
     const res = await request(app)
       .get("/api/v1/playlists")

       expect(res.statusCode).toEqual(200);
       expect(res.body.length).toEqual(0);
     });
   });
 })
});
