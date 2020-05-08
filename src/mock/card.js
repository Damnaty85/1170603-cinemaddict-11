import {getRandomIntegerNumber, getRandomArrayItem, getRandomDate, formatRuntime} from "../utils/common";
import {TITLES, DESCRIPTIONS, POSTERS, GENRES, DIRECTORS, WRITERS, ACTORS, COUNTRIES} from "../const";
import {generateComments} from "./comment";

const getRandomRating = (max, min) => `${getRandomIntegerNumber(max, min)}.${getRandomIntegerNumber(max, min)}`;

export const getRandomDuration = () => {
  const minutes = getRandomIntegerNumber(60);
  const hours = getRandomIntegerNumber(3, 1);

  return `${hours}h ${(minutes < 10) ? `0${minutes}` : minutes}m`;
};

const getRandomBoolean = () => (Math.random() > 0.5);

const generateCard = () => {
  const commentCount = getRandomIntegerNumber(30);

  return {
    title: getRandomArrayItem(TITLES),
    description: getRandomArrayItem(DESCRIPTIONS),
    poster: getRandomArrayItem(POSTERS),
    rating: getRandomRating(10, 1),
    commentCount,
    commentList: generateComments(commentCount),
    age: `${getRandomIntegerNumber(18, 5)}+`,
    dateRelease: getRandomDate(),
    duration: formatRuntime(getRandomIntegerNumber(200, 60)),
    genres: GENRES.filter(getRandomBoolean).slice(1, 4),
    director: DIRECTORS[getRandomIntegerNumber(DIRECTORS.length)],
    writers: WRITERS.filter(getRandomBoolean).slice(0, getRandomIntegerNumber(4, 1)).join(`, `),
    actors: ACTORS.filter(getRandomBoolean).slice(0, getRandomIntegerNumber(4, 1)).join(`, `),
    country: COUNTRIES[getRandomIntegerNumber(COUNTRIES.length)],
    isWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

export {generateCard, generateCards};
