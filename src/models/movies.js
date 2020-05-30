import {getCardsByFilter} from "../utils/filter.js";
import {getStatisticCardsByTime, FilterStatisticType} from "../utils/statistic";
import {FilterType} from "../const.js";

export default class Movies {
  constructor() {
    this._cards = [];
    this._activeFilterType = FilterType.ALL;
    this._filterStatisticType = FilterStatisticType.ALL_TIME;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getCards() {
    return getCardsByFilter(this._cards, this._activeFilterType);
  }

  getCardsAll() {
    return this._cards;
  }

  get watchedFilms() {
    return this._cards
      .filter((film) => film.isWatched);
  }

  get statisticsFilms() {
    return getStatisticCardsByTime(this.watchedFilms, this._filterStatisticType);
  }

  set statisticsFilms(filterStatisticType) {
    this._filterStatisticType = filterStatisticType;
  }

  setCards(cards) {
    this._cards = Array.from(cards);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateCards(id, card) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
