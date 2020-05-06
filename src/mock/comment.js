import {getRandomDate, formatTime, getRandomArrayItem, formatDate} from "../utils/common";
import {EMOJI_NAMES} from "../const";

const authorNameArray = [`Tim Macoveev`, `John Doe`, `Jane Doe`];

const commentTextArray = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`, `Want more!!!!`, `So stupid!`, `Very very very very horribly`];

const generateComment = () => {
  const commentDate = getRandomDate();
  const date = formatDate(commentDate);
  const time = formatTime(commentDate);

  return {
    emoji: getRandomArrayItem(EMOJI_NAMES),
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
