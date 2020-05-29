import API from "./API/index";
import Store from "./API/store.js";
import Provider from "./API/provider";
import RankComponent from "./components/user-rank";
import FilterController from "./controllers/filter";
import PageController from "./controllers/page-controller";
import StatisticsComponent from "./components/statistics.js";
import FilmCountComponent from "./components/film-count";
import MoviesModel from "./models/movies";
import {render, RenderPosition} from "./utils/render";
import {getWatched} from "./utils/filter";
import {FilterType} from "./const";

const AUTHORIZATION = `Basic sjdnfkjsdnfkjsd`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const moviesModel = new MoviesModel();

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const siteFooterStatistic = siteFooter.querySelector(`.footer__statistics`);

const filterController = new FilterController(siteMainElement, moviesModel);
const pageController = new PageController(siteMainElement, moviesModel, apiWithProvider);

apiWithProvider.getCards()
  .then((cards) => {
    moviesModel.setCards(cards);

    render(siteHeader, new RankComponent(getWatched(cards).length), RenderPosition.BEFOREEND);

    filterController.render();
    pageController.render(cards);

    const statisticsComponent = new StatisticsComponent(cards);
    render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
    statisticsComponent.hide();

    filterController.setScreenChange((filterType) => {
      if (filterType === FilterType.STATISTIC) {
        pageController.hide();
        statisticsComponent.show();
      } else {
        pageController.show();
        filterController._onFilterChange(filterType);
        statisticsComponent.hide();
      }
    });

    render(siteFooterStatistic, new FilmCountComponent(cards.length), RenderPosition.BEFOREEND);
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (apiWithProvider.getSynchronize()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      navigator.serviceWorker.ready.then((worker) => {
        worker.sync.register(`syncdata`);
      });
    });
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
