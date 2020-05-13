import CardComponent from "../components/film-card";
import CardDetailComponent from "../components/card-detail";
import {render, replace, remove, RenderPosition} from "../utils/render.js";

export const Mode = {
  DEFAULT: `default`,
  DETAIL: `detail`,
};

export default class CardController {
  constructor(container, onDataChange, onViewChange) {

    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._cardComponent = null;
    this._cardDetailComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card, mode) {
    const oldCardComponent = this._cardComponent;
    const oldCardDetailComponent = this._cardDetailComponent;
    this._mode = mode;

    this._cardComponent = new CardComponent(card);
    this._cardDetailComponent = new CardDetailComponent(card);

    this._cardComponent.setOpenDetailHandler(`.film-card__comments`, () => {
      this._popupOpenHandler();
    });

    this._cardComponent.setOpenDetailHandler(`.film-card__poster`, () => {
      this._popupOpenHandler();
    });

    this._cardComponent.setOpenDetailHandler(`.film-card__title`, () => {
      this._popupOpenHandler();
    });

    this._cardComponent.setWatchlistButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatchlist: !card.isWatchlist,
      }));
    });

    this._cardComponent.setWatchedButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatched: !card.isWatched,
      }));
    });

    this._cardComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    this._cardDetailComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatchlist: !card.isWatchlist,
      }));

    });

    this._cardDetailComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isWatched: !card.isWatched,
      }));
    });

    this._cardDetailComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    this._cardDetailComponent.setCloseDetailHandler(() => {
      this._buttonCloseHandler();
    });

    this._cardDetailComponent.setCommentsDeleteClickHandler((commentId) => {
      const newFilm = this._deleteComment(card, commentId);

      this._onDataChange(this, card, newFilm);
    });

    this._cardDetailComponent.setCommentSubmitHandler(() => {
      const newComment = this._cardDetailComponent.getAddCommentFormData();

      const updatedFilm = this._addComment(card, newComment);

      this._onDataChange(this, card, updatedFilm);
    });

    if (oldCardDetailComponent && oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._cardDetailComponent, oldCardDetailComponent);
    } else {
      render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._buttonCloseHandler();
    }
  }

  destroy() {
    remove(this._cardDetailComponent);
    remove(this._cardComponent);
  }

  _addComment(card, newComment) {
    const newFilm = Object.assign({}, card);
    newFilm.commentList = [...newFilm.commentList, newComment];

    return newFilm;
  }

  _deleteComment(card, commentId) {
    const newFilm = Object.assign({}, card);

    newFilm.commentList = newFilm.commentList.filter(({id}) => id !== commentId);

    return newFilm;
  }

  _popupOpenHandler() {
    this._onViewChange();
    const siteBody = document.querySelector(`body`);
    siteBody.classList.add(`hide-overflow`);
    render(siteBody, this._cardDetailComponent, RenderPosition.BEFOREEND);
    this._mode = Mode.DETAIL;

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
