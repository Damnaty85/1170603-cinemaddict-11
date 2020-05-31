import AbstractComponent from "./abstract-component";

const UserRank = {
  NOVICE: {
    min: 1,
    max: 7
  },
  FAN: {
    min: 8,
    max: 18
  },
  MOVIE_BUFF: {
    min: 19
  }
};

export const getUserRank = (moviesWatched) => {
  if (moviesWatched >= UserRank.NOVICE.min && moviesWatched <= UserRank.NOVICE.max) {
    return `Novice`;
  }
  if (moviesWatched >= UserRank.FAN.min && moviesWatched <= UserRank.FAN.max) {
    return `Fan`;
  }
  if (moviesWatched >= UserRank.MOVIE_BUFF.min) {
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
