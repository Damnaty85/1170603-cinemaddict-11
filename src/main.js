import RankComponent from "./components/user-rank";
import NavigationComponent from "./components/navigation";
import SortComponent from "./components/sort";
import FilmsComponent from "./components/main-container";
import FilmListComponent from "./components/films-list";
import ShowMoreButtonComponent from "./components/show-more";
import CardComponent from "./components/film-card";
import NoDataComponent from "./components/no-data";
import StatisticComponent from "./components/statistic";
import CardDetailComponent from "./components/card-detail";
import {generateNavigations} from "./mock/navigation";
import {generateSorts} from "./mock/sort";
import {generateCards} from "./mock/card";
import {render, RenderPosition} from "./utils.js";

const MOVIE_CARD_COUNT = 25;
const SHOWING_MOVIE_CARD_COUNT_ON_START = 5;
const SHOWING_MOVIE_CARD_COUNT_BY_BUTTON = 5;
const EXTRA_MOVIE_CARD_COUNT = 2;

const siteBody = document.querySelector(`body`);

const renderCard = (cardListElement, card) => {
  const popupOpenHandler = () => {
    siteBody.classList.add(`hide-overflow`);
    render(siteBody, cardDetailComponent.getElement(), RenderPosition.BEFOREEND);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const buttonCloseHandler = () => {
    siteBody.classList.remove(`hide-overflow`);
    cardDetailComponent.getElement().remove();
    cardDetailComponent.removeElement();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      buttonCloseHandler();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const cardComponent = new CardComponent(card);
  const detailComment = cardComponent.getElement().querySelector(`.film-card__comments`);
  const detailPoster = cardComponent.getElement().querySelector(`.film-card__poster`);
  const detailTitle = cardComponent.getElement().querySelector(`.film-card__title`);
  detailComment.addEventListener(`click`, popupOpenHandler);
  detailPoster.addEventListener(`click`, popupOpenHandler);
  detailTitle.addEventListener(`click`, popupOpenHandler);

  const cardDetailComponent = new CardDetailComponent(card);
  const detailFormClose = cardDetailComponent.getElement().querySelector(`.film-details__close-btn`);
  detailFormClose.addEventListener(`click`, buttonCloseHandler);

  render(cardListElement, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderList = (listComponent, cards) => {
  const isNodataToLoad = cards.every((card) => card.isNoData);

  if (isNodataToLoad) {
    render(listComponent.getElement(), new NoDataComponent().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  const cardListElement = listComponent.getElement().querySelector(`.films-list__container`);

  let showingCardsCount = SHOWING_MOVIE_CARD_COUNT_ON_START;
  cards.slice(0, showingCardsCount)
    .forEach((card) => {
      renderCard(cardListElement, card);
    });

  const showMoreButtonComponent = new ShowMoreButtonComponent();
  render(listComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingCardsCount;
    showingCardsCount = showingCardsCount + SHOWING_MOVIE_CARD_COUNT_BY_BUTTON;

    cards.slice(prevTasksCount, showingCardsCount)
      .forEach((task) => renderCard(cardListElement, task));

    if (showingCardsCount >= cards.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
};

const renderListExtra = (listExtraComponent, cards, sortingBy) => {
  const isNodataToLoad = cards.every((card) => card.isNoData);

  if (isNodataToLoad) {
    listExtraComponent.getElement().remove();
    return;
  }

  const cardListExtraElement = listExtraComponent.getElement().querySelector(`.films-list__container`);

  let showingCardsCount = EXTRA_MOVIE_CARD_COUNT;
  cards
    .sort((a, b) => b[sortingBy] - a[sortingBy])
    .slice(0, showingCardsCount)
    .forEach((card) => card[sortingBy] > 0 ? renderCard(cardListExtraElement, card) : null);
};

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const siteFooterStatistic = siteFooter.querySelector(`.footer__statistics`);

const navigations = generateNavigations();
const sort = generateSorts();
const cards = generateCards(MOVIE_CARD_COUNT);

render(siteHeader, new RankComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new NavigationComponent(navigations).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortComponent(sort).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsComponent().getElement(), RenderPosition.BEFOREEND);
render(siteFooterStatistic, new StatisticComponent(MOVIE_CARD_COUNT).getElement(), RenderPosition.BEFOREEND);

const filmsContainer = siteMainElement.querySelector(`.films`);

const listComponent = new FilmListComponent();
render(filmsContainer, listComponent.getElement(), RenderPosition.BEFOREEND);
renderList(listComponent, cards);


const listTopRatedComponent = new FilmListComponent(`--extra`, `Top rated`);
const listCommentedComponent = new FilmListComponent(`--extra`, `Most commented`);
render(filmsContainer, listTopRatedComponent.getElement(), RenderPosition.BEFOREEND);
render(filmsContainer, listCommentedComponent.getElement(), RenderPosition.BEFOREEND);
renderListExtra(listTopRatedComponent, cards, `rating`);
renderListExtra(listCommentedComponent, cards, `commentCount`);

