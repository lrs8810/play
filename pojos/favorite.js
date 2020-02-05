class Favorite {
  constructor(json) {
    this.artist = json.artist_name;
    this.title = json.track_name;
    this.rating = json.track_rating;
    this.genre = json.primary_genres.music_genre_list[0].music_genre.music_genre_name;
  }

  favoriteResponse(id) {
    return {
      id: id,
      title: this.title,
      artistName: this.artist,
      genre: this.genre,
      rating: this.rating
    }
  }
};

module.exports = Favorite;
