import {remove, render, RenderPosition} from "../utils/render";
import NavigationComponent from "../components/navigation";
import SortComponent, {SortType} from "../components/sort";
import FilmsComponent from "../components/main-container";
import FilmListComponent from "../components/films-list";
import CardComponent from "../components/film-card";
import NoDataComponent from "../components/no-data";
import CardDetailComponent from "../components/card-detail";
import ShowMoreButtonComponent from "../components/show-more";
import {generateNavigations} from "../mock/navigation";

const SHOWING_MOVIE_CARD_COUNT_ON_START = 5;
const SHOWING_MOVIE_CARD_COUNT_BY_BUTTON = 5;
const EXTRA_MOVIE_CARD_COUNT = 2;

const siteBody = document.querySelector(`body`);

const navigations = generateNavigations();

const renderCard = (cardListElement, card) => {
  const popupOpenHandler = () => {
    siteBody.classList.add(`hide-overflow`);
    render(siteBody, cardDetailComponent, RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const buttonCloseHandler = () => {
    siteBody.classList.remove(`hide-overflow`);
    remove(cardDetailComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      buttonCloseHandler();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const cardComponent = new CardComponent(card);

  cardComponent.setOpenDetailHandler(`.film-card__comments`, popupOpenHandler);
  cardComponent.setOpenDetailHandler(`.film-card__poster`, popupOpenHandler);
  cardComponent.setOpenDetailHandler(`.film-card__title`, popupOpenHandler);

  const cardDetailComponent = new CardDetailComponent(card);

  cardDetailComponent.setCloseDetailHandler(buttonCloseHandler);
  render(cardListElement, cardComponent, RenderPosition.BEFOREEND);
};

const renderExtraCard = (container, cards, sortingBy) => {
  const cardListExtraElement = container.querySelector(`.films-list__container`);

  let showingExtraCardsCount = EXTRA_MOVIE_CARD_COUNT;
  cards
    .sort((a, b) => b[sortingBy] - a[sortingBy])
    .slice(0, showingExtraCardsCount)
    .forEach((card) => card[sortingBy] > 0 ? renderCard(cardListExtraElement, card) : null);

  if (cards.length === 0) {
    remove(container);
    return;
  }
};

const getSortedTasks = (tasks, sortType, from, to) => {
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedTasks = showingTasks.sort((a, b) => a.dateRelease - b.dateRelease);
      break;
    case SortType.RATING:
      sortedTasks = showingTasks.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._navigationComponent = new NavigationComponent(navigations);
    this._sortComponent = new SortComponent();
    this._filmsComponent = new FilmsComponent();
    this._filmsListComponent = new FilmListComponent();
    this._noDataComponent = new NoDataComponent();
    this._showMoreComponent = new ShowMoreButtonComponent();

    this._topRatedFilmComponent = new FilmListComponent(`--extra`, `Top rated`);
    this._commentedFilmComponent = new FilmListComponent(`--extra`, `Most commented`);
  }

  render(cards) {
    const renderShowMoreButton = () => {
      if (showingCardsCount >= cards.length) {
        return;
      }

      render(filmListContainer, this._showMoreComponent, RenderPosition.BEFOREEND);

      this._showMoreComponent.setClickHandler(() => {
        const prevTasksCount = showingCardsCount;
        showingCardsCount = showingCardsCount + SHOWING_MOVIE_CARD_COUNT_BY_BUTTON;

        cards.slice(prevTasksCount, showingCardsCount)
          .forEach((task) => renderCard(cardListElement, task));

        if (showingCardsCount >= cards.length) {
          remove(this._showMoreComponent);
        }
      });
    };

    render(this._container, this._navigationComponent, RenderPosition.BEFOREEND);
    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._container, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), this._filmsListComponent, RenderPosition.BEFOREEND);

    if (cards.length === 0) {
      render(this._container, this._noDataComponent, RenderPosition.BEFOREEND);
      return;
    }

    const filmListContainer = this._filmsComponent.getElement().querySelector(`.films-list`);
    const cardListElement = filmListContainer.querySelector(`.films-list__container`);

    let showingCardsCount = SHOWING_MOVIE_CARD_COUNT_ON_START;

    cards.slice(0, showingCardsCount)
      .forEach((card) => {
        renderCard(cardListElement, card);
      });

    renderShowMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingCardsCount = SHOWING_MOVIE_CARD_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(cards, sortType, 0, showingCardsCount);

      cardListElement.innerHTML = ``;

      sortedTasks.slice(0, showingCardsCount)
        .forEach((task) => {
          renderCard(cardListElement, task);
        });

      renderShowMoreButton();
    });

    render(this._filmsComponent.getElement(), this._topRatedFilmComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent.getElement(), this._commentedFilmComponent, RenderPosition.BEFOREEND);

    renderExtraCard(this._topRatedFilmComponent.getElement(), cards, `rating`);
    renderExtraCard(this._commentedFilmComponent.getElement(), cards, `commentCount`);
  }
}
