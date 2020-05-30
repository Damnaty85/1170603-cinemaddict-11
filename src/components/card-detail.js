import AbstractSmartComponent from "./abstract-smart-component";
import {formatDate, formatRuntime} from "../utils/common";

const createGenresMarkup = (genres) => {
  const title = genres.length > 1 ? `Genres` : `Genre`;

  return (
    `<td class="film-details__term">${title}</td>
    <td class="film-details__cell">
      ${genres.map((it) => `<span class="film-details__genre">${it}</span>`).join(`\n`)}
    </td >`
  );
};

const createFilmDetailCardTemplate = (card, option) => {
  const {title, alternativeTitle, totalRating, poster, ageRating, director, writers, actors, releaseDate, releaseCountry, runtime, genres, description} = card;
  const {isWatchlist, isWatched, isFavorite} = option;
  const dateRelease = formatDate(releaseDate);
  const duration = formatRuntime(runtime);

  const genresMarkup = createGenresMarkup(genres);

  return (
    `<section class="film-details">
        <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
                <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${dateRelease}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  ${genres.length !== 0 ? genresMarkup : ``}
                </tr>
              </table>
          </table>

          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>
      <section class="film-details__controls">
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
      

        
      </section>
    </div>
  </form>
</section>`
  );
};

export default class CardDetail extends AbstractSmartComponent {
  constructor(card) {
    super();

    this._card = card;

    this._isWatchlist = this._card.isWatchlist;
    this._isWatched = this._card.isWatched;
    this._isFavorite = this._card.isFavorite;
    this._buttonCloseHandler = null;
  }

  getTemplate() {
    return createFilmDetailCardTemplate(this._card, {
      isWatchlist: this._isWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
    });
  }

  recoveryListeners() {
    this.setCloseDetailHandler(this._buttonCloseHandler);
    this.setWatchlistButtonClickHandler(this._addWatchListHandler);
    this.setWatchedButtonClickHandler(this._markAsWatchedHandler);
    this.setFavoritesButtonClickHandler(this._favoriteHandler);
  }

  rerender() {
    super.rerender();
  }

  setCloseDetailHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
    this._buttonCloseHandler = handler;
  }

  setWatchlistButtonClickHandler(handler) {
    this._element.querySelector(`.film-details__control-label--watchlist`)
      .addEventListener(`click`, handler);
    this._addWatchListHandler = handler;
  }

  setWatchedButtonClickHandler(handler) {
    this._element.querySelector(`.film-details__control-label--watched`)
      .addEventListener(`click`, handler);
    this._markAsWatchedHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this._element.querySelector(`.film-details__control-label--favorite`)
      .addEventListener(`click`, handler);
    this._favoriteHandler = handler;
  }
}
