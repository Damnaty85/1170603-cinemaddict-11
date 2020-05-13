import {FilterType} from "../const";

export const getActive = (cards) => {
  return cards.filter((card) => card.id);
};

export const getWatchlist = (cards) => {
  return cards.filter((card) => card.isWatchlist);
};

export const getWatched = (cards) => {
  return cards.filter((card) => card.isWatched);
};

export const getFavorite = (cards) => {
  return cards.filter((card) => card.isFavorite);
};

export const getCardsByFilter = (cards, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return getActive(cards);
    case FilterType.WATCHLIST:
      return getWatchlist(cards);
    case FilterType.HISTORY:
      return getWatched(cards);
    case FilterType.FAVORITES:
      return getFavorite(cards);
  }

  return cards;
};
