
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('playlists').del()
      // Inserts seed entries
    .then(() => {
      return Promise.all([
        knex('playlists').insert({title: 'Roadtrip!!!'},'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
