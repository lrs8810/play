var express = require('express');
var router = express.Router();

const fetch = require('node-fetch');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[environment];
const database = require('knex')(configuration);

router.post('/', (request, response) => {
  console.log(reques)
})

module.exports = router;
