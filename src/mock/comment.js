import {getRandomDate, getRandomArrayItem} from "../utils";

const emojiArray = [`smile`, `puke`, `angry`, `sleeping`];

const authorNameArray = [`Tim Macoveev`, `John Doe`, `Jane Doe`];

const commentTextArray = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];

const generateComment = () => {
  const commentDate = getRandomDate();

  return {
    emoji: getRandomArrayItem(emojiArray),
    commentText: getRandomArrayItem(commentTextArray),
    author: getRandomArrayItem(authorNameArray),
    commentDate,
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComment, generateComments};
