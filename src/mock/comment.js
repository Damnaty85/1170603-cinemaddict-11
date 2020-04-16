import {getRandomDate, getRandomArrayItem, formatTime} from "../utils";

const emojiArray = [`smile`, `puke`, `angry`, `sleeping`];

const authorNameArray = [`Tim Macoveev`, `John Doe`, `Jane Doe`];

const commentTextArray = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`, `Want more!!!!`, `So stupid!`, `Very very very very horribly`];

const commentDate = getRandomDate();
const date = commentDate.toLocaleDateString(`en-GB`);
const time = formatTime(commentDate);

const generateComment = () => {
  return {
    emoji: getRandomArrayItem(emojiArray),
    commentText: getRandomArrayItem(commentTextArray),
    author: getRandomArrayItem(authorNameArray),
    date: `${date} ${time}`,
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComments};
