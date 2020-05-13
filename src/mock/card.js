import {getRandomIntegerNumber, getRandomArrayItem, getRandomDate, formatRuntime} from "../utils/common";
import {TITLES, DESCRIPTIONS, POSTERS, GENRES, DIRECTORS, WRITERS, ACTORS, COUNTRIES} from "../const";
import {generateComments} from "./comment";

const getRandomRating = (max, min) => `${getRandomIntegerNumber(max, min)}.${getRandomIntegerNumber(max, min)}`;

const getRandomBoolean = () => (Math.random() > 0.5);

const generateCard = () => {
  const commentList = generateComments(getRandomIntegerNumber(20));

  return {
    id: String(new Date() + Math.random()),
    title: getRandomArrayItem(TITLES),
    description: getRandomArrayItem(DESCRIPTIONS),
    poster: getRandomArrayItem(POSTERS),
    rating: getRandomRating(10, 1),
    commentList,
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
