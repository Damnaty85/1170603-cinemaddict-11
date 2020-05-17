import RankComponent from "./components/user-rank";
import FilterController from "./controllers/filter";
import PageController from "./controllers/page-controller";
import StatisticsComponent from "./components/statistics.js";
import FilmCountComponent from "./components/film-count";
import MoviesModel from "./models/movies";
import {generateCards} from "./mock/card";
import {render, RenderPosition} from "./utils/render";
import {getWatched} from "./utils/filter";
import {FilterType} from "./const";

const MOVIE_CARD_COUNT = 25;
const cards = generateCards(MOVIE_CARD_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setCards(cards);

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const siteFooterStatistic = siteFooter.querySelector(`.footer__statistics`);

render(siteHeader, new RankComponent(getWatched(cards).length), RenderPosition.BEFOREEND);

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render(cards);

const pageController = new PageController(siteMainElement, moviesModel);
pageController.render(cards);

const statisticsComponent = new StatisticsComponent(cards);
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

const filterComponent = filterController.getFilterComponent();

filterComponent.setFilterChangeHandler((filterType) => {
  if (filterType === FilterType.STATISTIC) {
    pageController.hide();
    statisticsComponent.show();
    return;
  }

  pageController.show();
  statisticsComponent.hide();
});

render(siteFooterStatistic, new FilmCountComponent(cards.length), RenderPosition.BEFOREEND);
