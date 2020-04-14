import {generateCard} from "./card";
import {MONTH_NAMES} from "../const";

const card = generateCard();

const generateTableCell = () => {
  let genres = [`Drama`, `Film-Noir`, `Mystery`];
  let genreTemplate = ``;

  for (const genre of genres) {
    genreTemplate += `<span class="film-details__genre">${genre}</span>`;
  }

  const movieReleaseDate = `${card.date.getDate()} ${MONTH_NAMES[card.date.getMonth()]} ${card.date.getFullYear()}`;

  return [{
    cellName: `Director`,
    cellValue: `Anthony Mann`,
  }, {
    cellName: `Writers`,
    cellValue: `Anne Wigton, Heinz Herald, Richard Weil`,
  }, {
    cellName: `Actors`,
    cellValue: `Erich von Stroheim, Mary Beth Hughes, Dan Duryea`,
  }, {
    cellName: `Release Date`,
    cellValue: movieReleaseDate,
  }, {
    cellName: `Runtime`,
    cellValue: card.duration,
  }, {
    cellName: `Country`,
    cellValue: `USA`,
  }, {
    cellName: `Genres`,
    cellValue: genreTemplate,
  }];
};

export {generateTableCell};
