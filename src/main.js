import Api from "./api/index";
import Store from "./api/store.js";
import Provider from "./api/provider";
import RankComponent from "./components/user-rank";
import FilterController from "./controllers/filter";
import PageController from "./controllers/page-controller";
import StatisticsComponent from "./components/statistics.js";
import FilmCountComponent from "./components/film-count";
import MoviesModel from "./models/movies";
import {render, RenderPosition} from "./utils/render";
import {getWatched} from "./utils/filter";
import {FilterType} from "./const";

const AUTHORIZATION = `Basic mfkalkmflkmflamf214`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaaddict-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const moviesModel = new MoviesModel();

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);
const siteFooterStatistic = siteFooter.querySelector(`.footer__statistics`);

const filterController = new FilterController(siteMainElement, moviesModel);
const pageController = new PageController(siteMainElement, moviesModel, apiWithProvider);
const statisticsComponent = new StatisticsComponent(moviesModel);

filterController.render();

render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

pageController.renderLoadingComponent();

apiWithProvider.getCards()
  .then((cards) => {
    moviesModel.setCards(cards);

    render(siteHeader, new RankComponent(getWatched(cards).length), RenderPosition.BEFOREEND);

    pageController.render(cards);

    render(siteFooterStatistic, new FilmCountComponent(cards.length), RenderPosition.BEFOREEND);
  });

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

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (apiWithProvider.getSynchronize()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
