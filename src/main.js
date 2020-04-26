import RankComponent from "./components/user-rank";
import PageController from "./controllers/page-controller";
import StatisticComponent from "./components/statistic";
import {generateCards} from "./mock/card";
import {render, RenderPosition} from "./utils/render";

const MOVIE_CARD_COUNT = 25;
const cards = generateCards(MOVIE_CARD_COUNT);

const siteHeader = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const siteFooterStatistic = siteFooter.querySelector(`.footer__statistics`);

render(siteHeader, new RankComponent(), RenderPosition.BEFOREEND);

const pageController = new PageController(siteMainElement);
pageController.render(cards);

render(siteFooterStatistic, new StatisticComponent(cards.length), RenderPosition.BEFOREEND);
