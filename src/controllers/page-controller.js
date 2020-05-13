import {remove, render, RenderPosition, replace} from "../utils/render";
import SortComponent, {SortType} from "../components/sort";
import FilmsSectionComponent from "../components/main-container";
import FilmListComponent from "../components/films-list";
import NoDataComponent from "../components/no-data";
import ShowMoreButtonComponent from "../components/show-more";
import CardController, {Mode} from "./film-card";
import {generateSorts} from "../mock/sort";

const SHOWING_MOVIE_CARD_COUNT_ON_START = 5;
const SHOWING_MOVIE_CARD_COUNT_BY_BUTTON = 5;
const EXTRA_MOVIE_CARD_COUNT = 2;

const sorts = generateSorts();

const renderCards = (container, cards, onDataChange, onViewChange) => {

  const cardListElement = container.querySelector(`.films-list__container`);

  return cards.map((card) => {
    const cardController = new CardController(cardListElement, onDataChange, onViewChange);

    cardController.render(card);

    return cardController;
  });
};

const renderExtraCard = (container, cards, sortingBy, onDataChange, onViewChange) => {
  const cardListExtraElement = container.querySelector(`.films-list__container`);

  let showingExtraCardsCount = EXTRA_MOVIE_CARD_COUNT;
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
      const cardController = new CardController(cardListExtraElement, onDataChange, onViewChange);
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
      sortedCards = showingCards.sort((a, b) => b.dateRelease - a.dateRelease);
      break;
    case SortType.RATING:
      sortedCards = showingCards.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedCards = showingCards;
      break;
  }
  return sortedCards.slice(from, to);
};

export default class PageController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._showedCardControllers = [];
    this._showingCardsCount = SHOWING_MOVIE_CARD_COUNT_ON_START;

    this._sortComponent = new SortComponent(sorts);
    this._filmsSectionComponent = new FilmsSectionComponent();
    this._filmsListComponent = new FilmListComponent();
    this._topRatedFilmComponent = new FilmListComponent(`--extra`, `Top rated`);
    this._commentedFilmComponent = new FilmListComponent(`--extra`, `Most commented`);
    this._noDataComponent = new NoDataComponent();
    this._showMoreComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._moviesModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {

    const cards = this._moviesModel.getCards();
    const allCards = this._moviesModel.getCardsAll();

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsSectionComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent.getElement(), this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent.getElement(), this._topRatedFilmComponent, RenderPosition.BEFOREEND);
    render(this._filmsSectionComponent.getElement(), this._commentedFilmComponent, RenderPosition.BEFOREEND);

    if (cards.length === 0) {
      render(this._filmsListComponent.getElement(), this._noDataComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderCards(cards.slice(0, this._showingCardsCount));
    this._renderTopRatedCards(allCards);
    this._renderCommentedCards();
    this._renderShowMoreButton();
  }

  _renderCards(cards) {
    const filmListElement = this._filmsListComponent.getElement();

    const newCards = renderCards(filmListElement, cards, this._onDataChange, this._onViewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingCardsCount = this._showedCardControllers.length;
  }

  _renderTopRatedCards(cards) {
    renderExtraCard(this._topRatedFilmComponent.getElement(), cards, `rating`, this._onDataChange, this._onViewChange);
  }

  _renderCommentedCards() {
    const oldCardCommentedComponent = this._commentedFilmComponent;

    this._commentedFilmComponent = new FilmListComponent(`--extra`, `Most commented`);

    if (oldCardCommentedComponent) {
      replace(this._commentedFilmComponent, oldCardCommentedComponent);
    } else {
      render(this._filmsSectionComponent.getElement(), this._commentedFilmComponent, RenderPosition.BEFOREEND);
    }
    renderExtraCard(this._commentedFilmComponent.getElement(), this._moviesModel.getCardsAll(), `commentList`, this._onDataChange, this._onViewChange);
  }

  _removeCards() {
    this._showedCardControllers.forEach((cardController) => cardController.destroy());
    this._showedCardControllers = [];
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

  _updateCards(count) {
    this._removeCards();
    this._renderCards(this._moviesModel.getCards().slice(0, count));
    this._renderShowMoreButton();
  }

  _onDataChange(cardsController, oldData, newData) {
    const isSuccess = this._moviesModel.updateCards(oldData.id, newData);

    if (isSuccess) {
      cardsController.render(newData);
    }

    this._renderCommentedCards();
  }

  _onViewChange() {
    this._showedCardControllers.forEach((card) => card.setDefaultView());
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
    const newCards = renderCards(this._filmsListComponent.getElement(), sortedCards, this._onDataChange, this._onViewChange);

    this._showedCardControllers = this._showedCardControllers.concat(newCards);

    if (this._showingCardsCount >= cards.length) {
      remove(this._showMoreComponent);
    }
  }

  _onFilterChange() {
    this._updateCards(SHOWING_MOVIE_CARD_COUNT_ON_START);
  }
}
