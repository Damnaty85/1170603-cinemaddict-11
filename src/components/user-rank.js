import AbstractComponent from "./abstract-component";

const userRanks = {
  novice: {
    min: 1,
    max: 7
  },
  fan: {
    min: 8,
    max: 18
  },
  movieBuff: {
    min: 19
  }
};

export const getUserRank = (moviesWatched) => {
  if (moviesWatched >= userRanks.novice.min && moviesWatched <= userRanks.novice.max) {
    return `Novice`;
  }
  if (moviesWatched >= userRanks.fan.min && moviesWatched <= userRanks.fan.max) {
    return `Fan`;
  }
  if (moviesWatched >= userRanks.movieBuff.min) {
    return `Movie buff`;
  }

  return ``;
};

const createUserRankTemplate = (count) => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${getUserRank(count)}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Rank extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createUserRankTemplate(this._count);
  }
}
