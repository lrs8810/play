var express = require('express');
var router = express.Router();

const Favorite = require('../../../pojos/favorite');
const fetch = require('node-fetch');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);


router.post('/', (request, response) => {
  let music = request.body
  for (let requiredParameter of ['artistName', 'title']) {
    if (!music[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { artistName: <String>, title: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }
  var title = request.body.title.toLowerCase()
                                .split(' ')
                                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                                .join(' ');
  var artist = request.body.artistName.toLowerCase();
  fetch(`http://api.musixmatch.com/ws/1.1/matcher.track.get?q_artist=${artist}&q_track= ${title}&apikey=${process.env.MUSIXMATCH_API_KEY}`)
    .then(response => response.json())
    .then(json => {
      let favJson = json.message.body.track
      if (json.message.body === "") {
        response.status(400).json({error: "Favorite cannot be created"})
      } else if (isNaN(favJson.track_rating) || (favJson.track_rating < 1) || (favJson.track_rating > 100 )) {
          response.status(503).json({error: "Musixmatch returned a rating that was not an accepted integer"})
      } else {
          const newFavorite = new Favorite(favJson)
            database('favorites').insert({artistName: newFavorite.artist, title: newFavorite.title, rating: newFavorite.rating, genre: newFavorite.genre}, 'id')
              .then(favId => {
                let finalResponse = newFavorite.favoriteResponse(favId[0])
                response.status(201).json(finalResponse)
              })
            }
      });
});

router.get('/:id', (request, response) => {
  let id = request.params.id
  database('favorites').where('id', id)
  .select('id', 'title', 'artistName', 'genre', 'rating')
  .then(favorite => {
    if (favorite.length) {
      response.status(200).json(favorite[0]);
    } else {
      response.status(404).json({
        error: `Could not find favorite with id ${id}`
      });
    }
  })
  .catch(error => {
    response.status(500).json({ error });
  });
})

router.delete('/:id', (request, response) => {
  let id = request.params.id
  database('favorites').where('id', id).del()
  .then(favorite => {
    if (favorite > 0) {
      response.status(204).send();
    } else {
      response.status(404).json({
        error: `Could not find favorite with id ${id}`
      });
    }
  })
  .catch(error => {
    response.status(500).json({ error });
  });
})

module.exports = router;
