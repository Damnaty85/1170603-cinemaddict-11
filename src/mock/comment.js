import {getRandomDate, getRandomArrayItem, formatDateComment} from "../utils/common";
import {EMOJI_NAMES} from "../const";

const authorNameArray = [`Tim Macoveev`, `John Doe`, `Jane Doe`];

const commentTextArray = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`, `Want more!!!!`, `So stupid!`, `Very very very very horribly`];

const generateComment = () => {
  const commentDate = getRandomDate();
  const date = formatDateComment(commentDate);

  return {
    id: String(Math.random()),
    emoji: getRandomArrayItem(EMOJI_NAMES),
    commentText: getRandomArrayItem(commentTextArray),
    author: getRandomArrayItem(authorNameArray),
    date: `${date}`,
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generateComments};
