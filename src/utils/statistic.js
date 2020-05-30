import moment from 'moment';

export const FilterStatisticType = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`
};

const getAllTimeFilms = (films) => {
  return films;
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

export const getStatisticCardsByTime = (cards, filter) => {
  switch (filter) {
    case FilterStatisticType.ALL_TIME:
      return getAllTimeFilms(cards);
    case FilterStatisticType.TODAY:
      return getTodayWatchedFilms(cards);
    case FilterStatisticType.WEEK:
      return getWeekWatchedFilms(cards);
    case FilterStatisticType.MONTH:
      return getMonthWatchedFilms(cards);
    case FilterStatisticType.YEAR:
      return getYearWatchedFilms(cards);
  }
  return cards;
};
