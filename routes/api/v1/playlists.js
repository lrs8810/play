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

router.post('/', (request, response) => {
  if (request.body.title) {
    database('playlists').insert({title: request.body.title}, 'id')
    .then(playlist => {
      database('playlists').where('id', playlist[0])
      .then(newPlaylist => {
        response.status(201).json(newPlaylist[0])
      })
    }).catch((error) => {
      response.status(400).json({error: 'Title must be unique!'})
    })
  } else
  response.status(422).json({error: 'Playlist not created, please enter a title.'})

});

module.exports = router;
