import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import {getUserRank} from './user-rank';

const FilterStatisticType = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const getFilmsGenres = (cards) => {
  return cards
    .map((card) => card.genres)
    .reduce((acc, genre) => [...acc, ...genre], [])
    .reduce((obj, genre) => {
      if (!obj[genre]) {
        obj[genre] = 1;
      } else {
        obj[genre]++;
      }

      return obj;
    }, {});
};

const checkTotalDurationCount = (cards) => {
  if (!cards.length) {
    return cards.length;
  }

  return cards
    .map((card) => card.runtime)
    .reduce((acc, runtime) => acc + runtime);
};

const getFavoriteGenre = (genres) => {
  const sortedGenres = Object.entries(genres).sort((a, b) => b[1] - a[1]);
  const cardsCountFirstFavoriteGenre = sortedGenres[0][1];
  const cardsCountSecondFavoriteGenre = sortedGenres[1][1];
  const favoriteGenre = sortedGenres[0][0];

  if (cardsCountFirstFavoriteGenre === cardsCountSecondFavoriteGenre) {
    return `–`;
  }

  return favoriteGenre;
};

const renderChart = (statisticCtx, cards) => {
  const genres = getFilmsGenres(cards);

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: Object.keys(genres),
      datasets: [{
        data: Object.values(genres),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createUserRankTemplate = (count) => {
  return (
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRank(count)}</span>
    </p>`
  );
};

const createStatisticsTemplate = (watchedFilms) => {
  const watchedFilmsCount = (cards) => {
    return cards.map((card) => card.isWatched).reduce((acc, runtime) => acc + runtime);
  };

  const totalDurationCount = checkTotalDurationCount(watchedFilms);

  const hours = Math.trunc(totalDurationCount / 60);
  const minutes = totalDurationCount % 60;

  const favoriteGenre = getFavoriteGenre(getFilmsGenres(watchedFilms));

  return (
    `<section class="statistic">
      ${createUserRankTemplate(watchedFilmsCount(watchedFilms))}
      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>
        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsCount(watchedFilms)}<span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${hours} <span class="statistic__item-description">h</span> ${minutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${favoriteGenre}</p>
        </li>
      </ul>
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

const getTodayWatchedFilms = (cards) => {
  return cards
    .filter((card) => moment(card.watchingDate).isBetween(moment().startOf(`day`), moment().endOf(`day`)));
};

const getWeekWatchedFilms = (cards) => {
  return cards
    .filter((card) => moment(card.watchingDate).isBetween(moment().startOf(`isoWeek`), moment().endOf(`isoWeek`)));
};

const getMonthWatchedFilms = (cards) => {
  return cards
    .filter((card) => moment(card.watchingDate).isBetween(moment().startOf(`month`), moment().endOf(`month`)));
};

const getYearWatchedFilms = (cards) => {
  return cards
    .filter((card) => moment(card.watchingDate).isBetween(moment().startOf(`year`), moment().endOf(`year`)));
};

export default class Statistics extends AbstractSmartComponent {
  constructor(cards) {
    super();

    this._cards = cards;
    this._currentFilterStatisticType = FilterStatisticType.ALL_TIME;

    this._genresChart = null;
    this._todayWatchedFilms = getTodayWatchedFilms(this._cards);
    this._weekWatchedFIlms = getWeekWatchedFilms(this._cards);
    this._monthWatchedFIlms = getMonthWatchedFilms(this._cards);
    this._yearWatchedFIlms = getYearWatchedFilms(this._cards);

    this._onFilterChange = this._onFilterChange.bind(this);

    this._onFilterChange(this._currentFilterStatisticType);
    this._setFilterChangeHandler(this._onFilterChange);
  }

  getTemplate() {
    return createStatisticsTemplate(this._cards);
  }

  show() {
    super.show();

    this.rerender(this._cards);
  }

  recoveryListeners() {
    this._setFilterChangeHandler(this._onFilterChange);
  }

  rerender(cards) {
    this._cards = cards;

    super.rerender();

    this._renderCharts(this._cards);
  }

  _renderCharts(cards) {
    const element = this.getElement();
    const ctx = element.querySelector(`.statistic__chart`);

    this._resetChart();

    this._genresChart = renderChart(ctx, cards);
  }

  _resetChart() {
    if (this._genresChart) {
      this._genresChart.destroy();
      this._genresChart = null;
    }
  }

  _setFilterChangeHandler(handler) {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, (evt) => {
      if (evt.target.tagName !== `INPUT`) {
        return;
      }

      const filter = evt.target.value;

      this._currentFilterStatisticType = filter;

      handler(filter);
    });
  }

  _onFilterChange(filter) {
    switch (filter) {
      case FilterStatisticType.ALL_TIME:
        this._renderCharts(this._cards);
        break;
      case FilterStatisticType.TODAY:
        this._renderCharts(this._todayWatchedFilms);
        break;
      case FilterStatisticType.WEEK:
        this._renderCharts(this._weekWatchedFIlms);
        break;
      case FilterStatisticType.MONTH:
        this._renderCharts(this._monthWatchedFIlms);
        break;
      case FilterStatisticType.YEAR:
        this._renderCharts(this._yearWatchedFIlms);
        break;
    }
  }
}
