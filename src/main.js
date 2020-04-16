import {createUserRankTemplate} from "./components/user-rank";
import {createMainNavigationTemplate} from "./components/navigation";
import {createMainSortTemplate} from "./components/sort";
import {createContentTemplate} from "./components/main-container";
import {createFilmsListTemplate} from "./components/films-list";
import {createShowMoreButtonTemplate} from "./components/show-more";
import {createFilmCardTemplate} from "./components/film-card";
import {createFooterStatisticTemplate} from "./components/statistic";
import {createFilmDetailContainerTemplate} from "./components/detail-container";
import {createFilmDetailCardTemplate} from "./components/film-card-detail";
import {generateNavigations} from "./mock/navigation";
import {generateSorts} from "./mock/sort";
import {generateCards} from "./mock/card";

const MOVIE_CARD_COUNT = 25;
const SHOWING_MOVIE_CARD_COUNT_ON_START = 5;
const SHOWING_MOVIE_CARD_COUNT_BY_BUTTON = 5;
const EXTRA_LIST_COUNT = 2;
const EXTRA_MOVIE_CARD_COUNT = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteBody = document.querySelector(`body`);
const siteHeader = siteBody.querySelector(`.header`);
const siteMainElement = siteBody.querySelector(`.main`);
const filmsStatisticContainer = siteBody.querySelector(`.footer__statistics`);

const navigations = generateNavigations();
const sorts = generateSorts();

render(siteHeader, createUserRankTemplate());
render(siteMainElement, createMainNavigationTemplate(navigations));
render(siteMainElement, createMainSortTemplate(sorts));
render(siteMainElement, createContentTemplate());
render(filmsStatisticContainer, createFooterStatisticTemplate());

const filmsContent = siteMainElement.querySelector(`.films`);

render(filmsContent, createFilmsListTemplate());

const filmsList = filmsContent.querySelector(`.films-list`);

render(filmsList, createShowMoreButtonTemplate());

const filmListContainer = filmsList.querySelector(`.films-list__container`);

const cards = generateCards(MOVIE_CARD_COUNT);
const cardsExtra = generateCards(EXTRA_MOVIE_CARD_COUNT);

let showingMovieCardCount = SHOWING_MOVIE_CARD_COUNT_ON_START;

for (let i = 0; i < showingMovieCardCount; i++) {
  render(filmListContainer, createFilmCardTemplate(cards[i]));
}

for (let i = 0; i < EXTRA_LIST_COUNT; i++) {
  render(filmsContent, createFilmsListTemplate(`--extra`));
}

const filmsExtraListContainer = filmsContent.querySelectorAll(`.films-list--extra`);

filmsExtraListContainer.forEach((list) => {
  const extraFilmsListContainers = list.querySelectorAll(`.films-list__container`);

  extraFilmsListContainers.forEach((item) => {
    for (let i = 0; i < cardsExtra.length; i++) {
      render(item, createFilmCardTemplate(cardsExtra[i]));
    }
  });
});

render(siteBody, createFilmDetailContainerTemplate());

const detailFilmContainer = siteBody.querySelector(`.film-details`);

render(detailFilmContainer, createFilmDetailCardTemplate(cards[0]));


const showMoreButton = filmsContent.querySelector(`.films-list__show-more`);

showMoreButton.addEventListener(`click`, () => {
  const prevCardCount = showingMovieCardCount;
  showingMovieCardCount = showingMovieCardCount + SHOWING_MOVIE_CARD_COUNT_BY_BUTTON;

  cards.slice(prevCardCount, showingMovieCardCount)
    .forEach((task) => render(filmListContainer, createFilmCardTemplate(task), `beforeend`));

  if (showingMovieCardCount >= cards.length) {
    showMoreButton.remove();
  }
});
