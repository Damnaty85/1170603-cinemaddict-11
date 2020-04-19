import {generateCardControl} from "../mock/control";
import {createElement, setShortDescription} from "../utils";

const createButtonCardControlMarkup = (buttonData, isActive) => {
  const {name, controlClass} = buttonData;
  isActive = Math.random() > 0.5;

  return (
    `<button class="film-card__controls-item button film-card__controls-item--${controlClass} ${isActive ? `film-card__controls-item--active` : ``}">${name}</button>`
  );
};

const createFilmCardTemplate = (card) => {
  const {title, rating, dateRelease, duration, genres, poster, description, commentCount} = card;

  const control = generateCardControl();
  const buttonControl = control.map((it, i) => createButtonCardControlMarkup(it, i === 0)).join(`\n`);

  return (
    `<article class="film-card">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
                <span class="film-card__year">${dateRelease.getFullYear()}</span>
                <span class="film-card__duration">${duration}</span>
                <span class="film-card__genre">${genres[0]}</span>
            </p>
            <img src="./images/posters/${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${setShortDescription(description, 139)}</p>
            <a class="film-card__comments">${commentCount} comments</a>
            <form class="film-card__controls">
                ${buttonControl}
            </form>
        </article>`
  );
};

export default class Card {
  constructor(card) {
    this._card = card;

    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._card);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
