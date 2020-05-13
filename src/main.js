import RankComponent from "./components/user-rank";
import FilterController from "./controllers/filter";
import PageController from "./controllers/page-controller";
import StatisticComponent from "./components/statistic";
import MoviesModel from "./models/movies";
import {generateCards} from "./mock/card";
import {render, RenderPosition} from "./utils/render";

const MOVIE_CARD_COUNT = 25;
const cards = generateCards(MOVIE_CARD_COUNT);
const moviesModel = new MoviesModel();
moviesModel.setCards(cards);

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const siteFooterStatistic = siteFooter.querySelector(`.footer__statistics`);

render(siteHeader, new RankComponent(), RenderPosition.BEFOREEND);

const filterController = new FilterController(siteMainElement, moviesModel);
filterController.render(cards);

const pageController = new PageController(siteMainElement, moviesModel);
pageController.render(cards);

render(siteFooterStatistic, new StatisticComponent(cards.length), RenderPosition.BEFOREEND);
