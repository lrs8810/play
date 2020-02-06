var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Test the get favorites endpoint', () => {
  afterEach(async () => {
    await database.raw('truncate table favorites cascade');
  });
  describe('GET /api/v1/favorites', () => {
   it('happy path', async () => {
     let favorite_1 = {
       id: 1,
       title: 'We Will Rock You',
       artistName: 'Queen',
       genre: 'Awesome Rock',
       rating: 88
     };
     let favorite_2 = {
       id: 3,
       title: 'You Shook Me All Night Long',
       artistName: 'ACDC',
       genre: 'Awesome Rock',
       rating: 75
     };
     let favorite_3 = {
       id: 5,
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
