function formatFavorites(favorites) {
  favorites.map(favorite => {
    delete favorite.created_at;
    delete favorite.updated_at;
    return favorite;
  })
};
 module.exports = formatFavorites;
