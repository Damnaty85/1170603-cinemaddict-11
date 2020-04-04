import {createUserRankTemplate} from "./components/user-rank";
import {createMainNavigationTemplate} from "./components/navigation";
import {createMainSortTemplate} from "./components/sort";
import {createContentTemplate} from "./components/main-container";
import {createFilmsListTemplate} from "./components/films-list";
import {createShowMoreButtonTemplate} from "./components/show-more";
import {createFilmCardTemplate} from "./components/film-card";
import {createFooterStatisticTemplate} from "./components/statistic";
import {createFilmDetailContainerTemplate} from "./components/detail-container";
import {createFilmDetailCardTemplate} from "./components/film-card_detail";

const MOVIE_CARD_COUNT = 5;
const EXTRA_LIST_COUNT = 2;
const EXTRA_MOVIE_CARD_COUNT = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteBody = document.querySelector(`body`);
const siteHeader = siteBody.querySelector(`.header`);
const siteMainElement = siteBody.querySelector(`.main`);
const filmsStatisticContainer = siteBody.querySelector(`.footer__statistics`);

render(siteHeader, createUserRankTemplate());
render(siteMainElement, createMainNavigationTemplate());
render(siteMainElement, createMainSortTemplate());
render(siteMainElement, createContentTemplate());
render(filmsStatisticContainer, createFooterStatisticTemplate());

const filmsContent = siteMainElement.querySelector(`.films`);

render(filmsContent, createFilmsListTemplate());

const filmsList = filmsContent.querySelector(`.films-list`);

render(filmsList, createShowMoreButtonTemplate());

const filmListContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < MOVIE_CARD_COUNT; i++) {
  render(filmListContainer, createFilmCardTemplate());
}

for (let i = 0; i < EXTRA_LIST_COUNT; i++) {
  render(filmsContent, createFilmsListTemplate(`--extra`));
}

const filmsExtraListContainer = filmsContent.querySelectorAll(`.films-list--extra`);

filmsExtraListContainer.forEach((list) => {
  const extraFilmsListContainers = list.querySelectorAll(`.films-list__container`);

  extraFilmsListContainers.forEach((item) => {
    for (let i = 0; i < EXTRA_MOVIE_CARD_COUNT; i++) {
      render(item, createFilmCardTemplate());
    }
  });
});

render(siteBody, createFilmDetailContainerTemplate());

const detailFilmContainer = siteBody.querySelector(`.film-details`);

render(detailFilmContainer, createFilmDetailCardTemplate());
