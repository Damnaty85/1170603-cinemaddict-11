import AbstractComponent from "./abstract-component";
import {formatYear, setShortDescription} from "../utils/common";

const createButtonCardControlMarkup = (name, controlClass, isActive = true) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${controlClass} ${isActive ? `` : `film-card__controls-item--active`}">${name}</button>`
  );
};

const createFilmCardTemplate = (card) => {
  const {title, rating, dateRelease, duration, genres, poster, description, commentList} = card;

  const buttonAddWatchList = createButtonCardControlMarkup(`Add to watchlist`, `add-to-watchlist`, !card.isWatchlist);
  const buttonWatched = createButtonCardControlMarkup(`Mark as watched`, `mark-as-watched`, !card.isWatched);
  const buttonFavorite = createButtonCardControlMarkup(`Mark as favorite`, `favorite`, !card.isFavorite);

  const date = formatYear(dateRelease);
  const commentCount = commentList.length;

  return (
    `<article class="film-card">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
                <span class="film-card__year">${date}</span>
                <span class="film-card__duration">${duration}</span>
                <span class="film-card__genre">${genres[0]}</span>
            </p>
            <img src="./images/posters/${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${setShortDescription(description, 139)}</p>
            <a class="film-card__comments">${commentCount} comments</a>
            <form class="film-card__controls">
                ${buttonAddWatchList}
                ${buttonWatched}
                ${buttonFavorite}
            </form>
        </article>`
  );
};

export default class Card extends AbstractComponent {
  constructor(card) {
    super();

    this._card = card;
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  setOpenDetailHandler(selector, handler) {
    this.getElement().querySelector(selector)
      .addEventListener(`click`, handler);
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
