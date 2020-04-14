import {getRandomArrayItem, getRandomIntegerNumber} from "../utils";

const titleArray = [`The Dance of Life`, `The Man with the Golden Arm`, `Santa Claus Conquers the Martians`];

const descriptionArray = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`
];

const posterArray = [`santa-claus-conquers-the-martians.jpg`, `the-man-with-the-golden-arm.jpg`, `the-dance-of-life.jpg`];

const rating = `${getRandomIntegerNumber(0, 9)}.${getRandomIntegerNumber(1, 9)}`;

const generateCard = () => {
  return {
    title: getRandomArrayItem(titleArray),
    description: getRandomArrayItem(descriptionArray),
    poster: getRandomArrayItem(posterArray),
    rating,
    commentCount: 12,
    age: `18+`,
    date: new Date(),
    duration: `1h 18m`,
    genre: `Mystery`,
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

export {generateCard, generateCards};
