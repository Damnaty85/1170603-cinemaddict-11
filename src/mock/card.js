import {getRandomArrayItem, getRandomIntegerNumber, getRandomDate} from "../utils";
import {TITLE, DESCRIPTION, POSTER, GENRES, DIRECTORS, WRITERS, ACTORS, COUNTRY} from "../const";

const getRandomRating = (max, min) => `${getRandomIntegerNumber(max, min)}.${getRandomIntegerNumber(max, min)}`;

export const getRandomDuration = () => {
  const minutes = getRandomIntegerNumber(60);
  const hours = getRandomIntegerNumber(3, 1);

  return `${hours}h ${(minutes < 10) ? `0${minutes}` : minutes}m`;
};

const generateCard = () => {
  return {
    title: getRandomArrayItem(TITLE),
    description: getRandomArrayItem(DESCRIPTION),
    poster: getRandomArrayItem(POSTER),
    rating: getRandomRating(10, 1),
    commentCount: getRandomIntegerNumber(20),
    age: `${getRandomIntegerNumber(18, 5)}+`,
    dateRelease: getRandomDate(),
    duration: getRandomDuration(),
    genres: GENRES.filter(Boolean).slice(3, 6),
    director: DIRECTORS[getRandomIntegerNumber(DIRECTORS.length)],
    writers: WRITERS.filter(Boolean).slice(0, getRandomIntegerNumber(3, 1)).join(`, `),
    actors: ACTORS.filter(Boolean).slice(0, getRandomIntegerNumber(3, 1)).join(`, `),
    country: COUNTRY[getRandomIntegerNumber(COUNTRY.length)],
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

export {generateCard, generateCards};
