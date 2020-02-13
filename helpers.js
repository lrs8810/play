
const calculateSongAvgRating = (favorites) => {
  if (favorites.length === 0) return 0
  const totalRating = favorites.reduce((sum, favorite) => {
    sum += favorite.rating
    return sum
  }, 0)
  return totalRating / favorites.length
};

module.exports = calculateSongAvgRating;
