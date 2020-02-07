var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

router.get('/', (request, response) => {
  database('playlists').select()
    .then(playlists => {
      response.status(200).json(playlists)
    }).catch(error => response.status(404).json({error: error}))
});

module.exports = router;
