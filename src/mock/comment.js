import {getRandomDate, formatTime, getRandomArrayItem} from "../utils/common";
import {EMOJI_NAME} from "../const";

const authorNameArray = [`Tim Macoveev`, `John Doe`, `Jane Doe`];

const commentTextArray = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`, `Want more!!!!`, `So stupid!`, `Very very very very horribly`];

const generateComment = () => {
  const commentDate = getRandomDate();
  const date = commentDate.toLocaleDateString(`en-GB`);
  const time = formatTime(commentDate);

  return {
    emoji: getRandomArrayItem(EMOJI_NAME),
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
