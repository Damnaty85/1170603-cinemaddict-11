import {remove, render, RenderPosition, replace} from "../utils/render";
import SortComponent, {SortType} from "../components/sort";
import LoadingComponent from "../components/loading";
import FilmsSectionComponent from "../components/main-container";
import FilmListComponent from "../components/films-list";
import NoDataComponent from "../components/no-data";
import ShowMoreButtonComponent from "../components/show-more";
import CardController, {Mode} from "./film-card";
import {generateSorts} from "../mock/sort";
import {formatYear} from "../utils/common";

const SHOWING_MOVIE_CARD_COUNT_ON_START = 5;
const SHOWING_MOVIE_CARD_COUNT_BY_BUTTON = 5;
const EXTRA_MOVIE_CARD_COUNT = 2;

const sorts = generateSorts();

const renderCards = (container, cards, onDataChange, onViewChange, onCommentsDataChange, api) => {

  const cardListElement = container.querySelector(`.films-list__container`);

  return cards.map((card) => {
    const cardController = new CardController(cardListElement, onDataChange, onViewChange, onCommentsDataChange, api);

    cardController.render(card, Mode.DEFAULT);

    return cardController;
  });
};

const renderExtraCard = (container, cards, sortingBy, onDataChange, onViewChange, onCommentsDataChange, api) => {
  const cardListExtraElement = container.querySelector(`.films-list__container`);

  const showingExtraCardsCount = EXTRA_MOVIE_CARD_COUNT;
  cards
    .slice()
    .sort((a, b) => {
      if (a[sortingBy] instanceof Array) {
        return b[sortingBy].length - a[sortingBy].length;
      }
      return b[sortingBy] - a[sortingBy];
    })
    .slice(0, showingExtraCardsCount)
    .map((card) => {
      const cardController = new CardController(cardListExtraElement, onDataChange, onViewChange, onCommentsDataChange, api);
      const sortPropValue = card[sortingBy] instanceof Array ? card[sortingBy].length : card[sortingBy];

      if (sortPropValue > 0) {
        cardController.render(card, Mode.DEFAULT);
      }

      return cardController;
    });
};

const getSortedCards = (cards, sortType, from, to) => {
  let sortedCards = [];
  const showingCards = cards.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedCards = showingCards.sort((a, b) => formatYear(b.releaseDate) - formatYear(a.releaseDate));
      break;
    case SortType.RATING:
      sortedCards = showingCards.sort((a, b) => b.totalRating - a.totalRating);
      break;
    case SortType.DEFAULT:
      sortedCards = showingCards;
      break;
  }
  return sortedCards.slice(from, to);
};

export default class PageController {
  constructor(container, moviesModel, api) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._api = api;
    this._showedCardControllers = [];
    this._showingCardsCount = SHOWING_MOVIE_CARD_COUNT_ON_START;

    this._sortComponent = new SortComponent(sorts);
    this._loadingComponent = new LoadingComponent();
    this._filmsSectionComponent = new FilmsSectionComponent();
    this._filmsListComponent = new FilmListComponent();
    this._topRatedFilmComponent = new FilmListComponent(`--extra`, `Top rated`);
    this._commentedFilmComponent = new FilmListComponent(`--extra`, `Most commented`);
    this._noDataComponent = new NoDataComponent();
    this._showMoreComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onCommentsDataChange = this._onCommentsDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._filmsSectionComponent.hide();
    this._sortComponent.hide();
  }

  show() {
    this._filmsSectionComponent.show();
    this._sortComponent.show();
  }

  renderLoadingComponent() {
    render(this._container, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  render() {

    const cards = this._moviesModel.getCards();
    const allCards = this._moviesModel.getCardsAll();

    remove(this._loadingComponent);

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent.getElement(), this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent.getElement(), this._topRatedFilmComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent.getElement(), this._commentedFilmComponent, RenderPosition.BEFOREEND);

    if (cards.length === 0) {
      render(this._filmsListComponent.getElement(), this._noDataComponent, RenderPosition.BEFOREEND);
      remove(this._topRatedFilmComponent);
      remove(this._commentedFilmComponent);
      return;
    }

    this._renderCards(cards.slice(0, this._showingCardsCount));
    this._renderTopRatedCards(allCards);
    this._renderCommentedCards();
    this._renderShowMoreButton();
  }

  _renderCards(cards) {
    const filmListElement = this._filmsListComponent.getElement();

    const newCards = renderCards(filmListElement, cards, this._onDataChange, this._onCommentsDataChange, this._onViewChange, this._api);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingCardsCount = this._showedCardControllers.length;
  }

  _renderTopRatedCards(cards) {
    renderExtraCard(this._topRatedFilmComponent.getElement(), cards, `totalRating`, this._onDataChange, this._onCommentsDataChange, this._onViewChange, this._api);
  }

  _renderCommentedCards() {
    const oldCardCommentedComponent = this._commentedFilmComponent;

    this._commentedFilmComponent = new FilmListComponent(`--extra`, `Most commented`);

    if (oldCardCommentedComponent) {
      replace(this._commentedFilmComponent, oldCardCommentedComponent);
    } else {
      render(this._filmsSectionComponent.getElement(), this._commentedFilmComponent, RenderPosition.BEFOREEND);
    }
    renderExtraCard(this._commentedFilmComponent.getElement(), this._moviesModel.getCardsAll(), `comments`, this._onDataChange, this._onCommentsDataChange, this._onViewChange, this._api);
  }

  _renderShowMoreButton() {
    remove(this._showMoreComponent);

    if (this._showingCardsCount >= this._moviesModel.getCards().length) {
      return;
    }

    const filmListContainer = this._filmsSectionComponent.getElement().querySelector(`.films-list`);

    render(filmListContainer, this._showMoreComponent, RenderPosition.BEFOREEND);

    this._showMoreComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _removeCards() {
    this._showedCardControllers = this._filmsListComponent.getElement().querySelector(`.films-list__container`);
    this._showedCardControllers.innerHTML = ``;

    this._showedCardControllers = [];
  }

  _updateCards(count) {
    this._removeCards();
    this._renderCards(this._moviesModel.getCards().slice(0, count));
    this._renderShowMoreButton();
  }

  _onViewChange() {
    this._showedCardControllers.forEach((card) => card.setDefaultView());
  }

  _onDataChange(cardController, oldData, newData) {
    this._api.updateCard(oldData.id, newData)
      .then((cardModel) => {
        const isSuccess = this._moviesModel.updateCards(oldData.id, cardModel);

        if (isSuccess) {
          cardController.render(cardModel, Mode.DEFAULT);

          this._updateCards(this._showingCardsCount);

          cardController._commentsController.loadComments(newData.id);
        }

        this._renderCommentedCards();
      })
      .catch(() => {
        cardController._shake();
      });
  }

  _onCommentsDataChange(cardController, card) {
    this._api.updateCard(card.id, card)
      .then((cardModel) => {
        const isSuccess = this._moviesModel.updateCards(card.id, cardModel);

        if (isSuccess) {
          cardController.render(cardModel, Mode.DEFAULT);
          cardController._commentsController.loadComments(card.id);

          this._renderCommentedCards();

          this._updateCards(this._showingCardsCount);
        }
      });
  }

  _onSortTypeChange(sortType) {
    this._showingCardsCount = SHOWING_MOVIE_CARD_COUNT_BY_BUTTON;

    const sortedCards = getSortedCards(this._moviesModel.getCards(), sortType, 0, this._showingCardsCount);

    this._removeCards();
    this._renderCards(sortedCards);

    this._renderShowMoreButton();
  }

  _onShowMoreButtonClick() {
    const prevCardsCount = this._showingCardsCount;
    const cards = this._moviesModel.getCards();
    this._showingCardsCount = this._showingCardsCount + SHOWING_MOVIE_CARD_COUNT_BY_BUTTON;

    const sortedCards = getSortedCards(cards, this._sortComponent.getSortType(), prevCardsCount, this._showingCardsCount);
    const newCards = renderCards(this._filmsListComponent.getElement(), sortedCards, this._onDataChange, this._onCommentsDataChange, this._onViewChange, this._api);

    this._showedCardControllers = this._showedCardControllers.concat(newCards);

    if (this._showingCardsCount >= cards.length) {
      remove(this._showMoreComponent);
    }
  }

  _onFilterChange() {
    this._updateCards(SHOWING_MOVIE_CARD_COUNT_ON_START);
  }
}
