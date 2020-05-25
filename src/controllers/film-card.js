import CardComponent from "../components/film-card";
import CardDetailComponent from "../components/card-detail";
import CommentController from "./comments";
import {render, replace, remove, RenderPosition} from "../utils/render.js";
import CardModel from "../models/card";

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  DEFAULT: `default`,
  DETAIL: `detail`,
};

export default class CardController {
  constructor(container, onDataChange, onViewChange, onCommentsDataChange) {

    this._container = container;
    this._onDataChange = onDataChange;
    this._onCommentsDataChange = onCommentsDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._shake = this._shake.bind(this);
    this._cardComponent = null;
    this._cardDetailComponent = null;
    this._commentsContainer = null;
    this._commentsController = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onCommentsCountChange = this._onCommentsCountChange.bind(this);
  }

  _marWatchListButtonClickHandler(data) {
    const newMovie = CardModel.clone(data);
    newMovie.isWatchlist = !newMovie.isWatchlist;

    this._onDataChange(this, data, newMovie);
  }

  _markWatchedButtonClickHandler(data) {
    const newMovie = CardModel.clone(data);
    newMovie.isWatched = !newMovie.isWatched;

    this._onDataChange(this, data, newMovie);
  }

  _markFavoriteButtonClickHandler(data) {
    const newMovie = CardModel.clone(data);
    newMovie.isFavorite = !newMovie.isFavorite;

    this._onDataChange(this, data, newMovie);
  }

  render(card, mode) {
    const oldCardComponent = this._cardComponent;
    const oldCardDetailComponent = this._cardDetailComponent;
    this._mode = mode;

    this._cardComponent = new CardComponent(card);
    this._cardDetailComponent = new CardDetailComponent(card);

    this._commentsContainer = this._cardDetailComponent.getElement().querySelector(`.film-details__comments-wrap`);

    this._commentsController = new CommentController(this._commentsContainer, card);

    this._commentsController.shake = this._shake;

    this._commentsController.onCommentsCountChangeHandler(this._onCommentsCountChange);

    this._cardComponent.setOpenDetailHandler(`.film-card__comments`, () => {
      this._popupOpenHandler(card);
    });

    this._cardComponent.setOpenDetailHandler(`.film-card__poster`, () => {
      this._popupOpenHandler(card);
    });

    this._cardComponent.setOpenDetailHandler(`.film-card__title`, () => {
      this._popupOpenHandler(card);
    });

    this._cardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._marWatchListButtonClickHandler(card);
    });

    this._cardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._markWatchedButtonClickHandler(card);
    });

    this._cardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._markFavoriteButtonClickHandler(card);
    });

    this._cardDetailComponent.setWatchlistButtonClickHandler(() => {
      this._marWatchListButtonClickHandler(card);
    });

    this._cardDetailComponent.setWatchedButtonClickHandler(() => {
      this._markWatchedButtonClickHandler(card);
    });

    this._cardDetailComponent.setFavoritesButtonClickHandler(() => {
      this._markFavoriteButtonClickHandler(card);
    });

    this._cardDetailComponent.setCloseDetailHandler(() => {
      this._buttonCloseHandler();
    });

    if (oldCardDetailComponent && oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._cardDetailComponent, oldCardDetailComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }

    this._commentsController.renderCommentForm();
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._buttonCloseHandler();
    }
  }

  destroy() {
    remove(this._cardDetailComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _shake() {
    this._cardDetailComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._cardDetailComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _onCommentsCountChange(card, updatedFilm) {
    this._onCommentsDataChange(this, card, updatedFilm);
  }

  _popupOpenHandler(card) {
    this._onViewChange();
    const siteBody = document.querySelector(`body`);
    siteBody.classList.add(`hide-overflow`);
    render(siteBody, this._cardDetailComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.DETAIL;

    this._commentsController.loadComments(card.id);

    document.addEventListener(`keydown`, this._onEscKeyDown);
  }

  _buttonCloseHandler() {
    remove(this._cardDetailComponent);
    const siteBody = document.querySelector(`body`);
    siteBody.classList.remove(`hide-overflow`);
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._buttonCloseHandler();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
