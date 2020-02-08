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

router.put('/:id', (request, response) => {
  let id = request.params.id
  let title = request.body.title

  if (isNaN(id)) {
    response.status(400).json({
      error: "Please send a valid integer as the id parameter."
    });
  } else if (!title) {
    response.status(422).json({
      error: "Playlist not updated, please enter a title."
    });
  } else {
    database('playlists').where({id: id}).update({title: title})
    .then(playlist => {
      if (playlist === 1) {
        database('playlists').where('id', id)
        .then(updatedPlaylist => {
          response.status(200).json(updatedPlaylist[0])
        })
        .catch(error => {
          console.log(error)
          response.status(500).send()
        })
      } else {
        response.status(404).json({
          error: `Could not find playlist with id ${id}`
        });
      }
    })
    .catch(error => {
      response.status(409).json({ error: "Title must be unique!"});
    });
  }
})

router.delete('/:id', (request, response) => {
  let id = request.params.id
  database('playlists').where('id', id).del()
  .then(playlist => {
    if (playlist > 0) {
      response.status(204).send();
    } else {
      response.status(404).json({
        error: `Could not find playlist with id ${id}`
      });
    }
  })
  .catch(error => {
    response.status(500).json({ error });
  });
})


module.exports = router;
