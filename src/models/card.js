export default class Card {
  constructor(data) {
    this.id = data.id;
    this.comments = data.comments;
    this.title = data.film_info.title;
    this.alternativeTitle = data.film_info.alternative_title;
    this.totalRating = data.film_info.total_rating;
    this.poster = data.film_info.poster;
    this.ageRating = data.film_info.age_rating;
    this.director = data.film_info.director;
    this.writers = data.film_info.writers;
    this.actors = data.film_info.actors;
    this.releaseDate = data.film_info.release.date;
    this.releaseCountry = data.film_info.release.release_country;
    this.runtime = data.film_info.runtime;
    this.genres = data.film_info.genre;
    this.description = data.film_info.description;
    this.isWatchlist = Boolean(data.user_details.watchlist);
    this.isWatched = Boolean(data.user_details.already_watched);
    this.watchingDate = data.user_details.watching_date;
    this.isFavorite = Boolean(data.user_details.favorite);
  }

  static parse(result) {
    return new Card(result);
  }

  static parseAll(result) {
    return result.map(Card.parse);
  }

  toRAW() {
    return {
      'id': this.id,
      'comments': this.comments,
      'film_info': {
        'title': this.title,
        'alternative_title': this.alternativeTitle,
        'total_rating': this.totalRating,
        'poster': this.poster,
        'age_rating': this.ageRating,
        'director': this.director,
        'writers': this.writers,
        'actors': this.actors,
        'release': {
          'date': this.releaseDate,
          'release_country': this.releaseCountry
        },
        'runtime': this.runtime,
        'genre': this.genres,
        'description': this.description,
      },
      'user_details': {
        'watchlist': this.isWatchlist,
        'already_watched': this.isWatched,
        'watching_date': this.watchingDate,
        'favorite': this.isFavorite
      }
    };
  }

  static clone(card) {
    return new Card(card.toRAW());
  }
}
