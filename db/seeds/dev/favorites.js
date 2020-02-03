
exports.seed = function(knex) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('favorites').del() // delete all footnotes first

    .then(() => {
      return Promise.all([
        knex('favorites').insert({title: 'Piano Man',
                                  artistName: 'Elton John',
                                  genre: 'Pop',
                                  rating: 100},
                                  'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
