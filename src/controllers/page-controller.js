import {remove, render, RenderPosition} from "../utils/render";
import NavigationComponent from "../components/navigation";
import SortComponent, {SortType} from "../components/sort";
import FilmsComponent from "../components/main-container";
import FilmListComponent from "../components/films-list";
import NoDataComponent from "../components/no-data";
import ShowMoreButtonComponent from "../components/show-more";
import CardController from "./film-card";
import {generateNavigations} from "../mock/navigation";
import {generateSorts} from "../mock/sort";

const SHOWING_MOVIE_CARD_COUNT_ON_START = 5;
const SHOWING_MOVIE_CARD_COUNT_BY_BUTTON = 5;
const EXTRA_MOVIE_CARD_COUNT = 2;

const navigations = generateNavigations();
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
    .sort((a, b) => b[sortingBy] - a[sortingBy])
    .slice(0, showingExtraCardsCount)
    .map((card) => {
      const cardController = new CardController(cardListExtraElement, onDataChange, onViewChange);

      if (card[sortingBy] > 0) {
        cardController.render(card);
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
  constructor(container) {
    this._container = container;

    this._cards = [];
    this._showedCardControllers = [];

    this._showingCardsCount = SHOWING_MOVIE_CARD_COUNT_ON_START;

    this._navigationComponent = new NavigationComponent(navigations);
    this._sortComponent = new SortComponent(sorts);
    this._filmsComponent = new FilmsComponent();
    this._filmsListComponent = new FilmListComponent();
    this._topRatedFilmComponent = new FilmListComponent(`--extra`, `Top rated`);
    this._commentedFilmComponent = new FilmListComponent(`--extra`, `Most commented`);
    this._noDataComponent = new NoDataComponent();
    this._showMoreComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cards) {
    this._cards = cards;

    render(this._container, this._navigationComponent, RenderPosition.BEFOREEND);
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), this._filmsListComponent, RenderPosition.BEFOREEND);

    if (cards.length === 0) {
      render(this._container, this._noDataComponent, RenderPosition.BEFOREEND);
      return;
    }

    const newCards = renderCards(this._filmsListComponent.getElement(), this._cards.slice(0, this._showingCardsCount), this._onDataChange, this._onViewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);

    this._renderShowMoreButton();

    render(this._filmsComponent.getElement(), this._topRatedFilmComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), this._commentedFilmComponent, RenderPosition.BEFOREEND);

    renderExtraCard(this._topRatedFilmComponent.getElement(), this._cards, `rating`, this._onDataChange, this._onViewChange);
    renderExtraCard(this._commentedFilmComponent.getElement(), this._cards, `commentCount`, this._onDataChange, this._onViewChange);
  }

  _renderShowMoreButton() {
    if (this._showingCardsCount >= this._cards.length) {
      return;
    }

    const filmListContainer = this._filmsComponent.getElement().querySelector(`.films-list`);

    render(filmListContainer, this._showMoreComponent, RenderPosition.BEFOREEND);

    this._showMoreComponent.setClickHandler(() => {
      const prevCardsCount = this._showingCardsCount;
      this._showingCardsCount = this._showingCardsCount + SHOWING_MOVIE_CARD_COUNT_BY_BUTTON;

      const sortedCards = getSortedCards(this._cards, this._sortComponent.getSortType(), prevCardsCount, this._showingCardsCount);
      const newCards = renderCards(this._filmsListComponent.getElement(), sortedCards, this._onDataChange, this._onViewChange);

      this._showedCardControllers = this._showedCardControllers.concat(newCards);

      if (this._showingCardsCount >= this._cards.length) {
        remove(this._showMoreComponent);
      }
    });
  }

  _onDataChange(cardsController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    cardsController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedCardControllers.forEach((card) => card.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingCardsCount = SHOWING_MOVIE_CARD_COUNT_BY_BUTTON;
    const cardListElement = this._container.querySelector(`.films-list__container`);

    const sortedCards = getSortedCards(this._cards, sortType, 0, this._showingCardsCount);

    cardListElement.innerHTML = ``;

    const newCards = renderCards(this._filmsListComponent.getElement(), sortedCards, this._onDataChange, this._onViewChange);
    this._showedCardControllers = newCards;

    this._renderShowMoreButton();
  }
}
