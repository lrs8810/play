
exports.up = function(knex) {
  return Promise.all([
    knex.schema.table('playlists_favorites',
      function(table) {
        table.renameColumn('created_at', 'createdAt');
        table.renameColumn('updated_at', 'updatedAt');
      })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.table('playlists_favorites',
      function(table) {
        table.renameColumn('createdAt', 'created_at');
        table.renameColumn('updatedAt', 'updated_at');
      })
  ])
};
