import API from "./api.js";
import RankComponent from "./components/user-rank";
import FilterController from "./controllers/filter";
import PageController from "./controllers/page-controller";
import StatisticsComponent from "./components/statistics.js";
import FilmCountComponent from "./components/film-count";
import MoviesModel from "./models/movies";
import {render, RenderPosition} from "./utils/render";
import {getWatched} from "./utils/filter";
import {FilterType} from "./const";

const AUTHORIZATION = `Basic 923i402763940-su-37`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const siteFooterStatistic = siteFooter.querySelector(`.footer__statistics`);

api.getCards()
  .then((cards) => {
    moviesModel.setCards(cards);

    render(siteHeader, new RankComponent(getWatched(cards).length), RenderPosition.BEFOREEND);

    const filterController = new FilterController(siteMainElement, moviesModel);
    filterController.render(cards);

    const pageController = new PageController(siteMainElement, moviesModel, api);
    pageController.render(cards);

    const statisticsComponent = new StatisticsComponent(moviesModel.getCardsAll());
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
  });


