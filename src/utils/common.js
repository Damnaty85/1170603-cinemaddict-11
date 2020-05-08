import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";

momentDurationFormatSetup(moment);

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM Y`);
};

export const formatYear = (date) => {
  return moment(date).format(`Y`);
};

export const formatDateComment = (date) => {
  return moment(date).format(`DD/MM/Y hh:mm`);
};

export const formatRuntime = (number) => {
  return moment.duration(number, `minute`).format(`h[h] mm[m]`);
};

export const getRandomIntegerNumber = (max, min = 0) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomDate = (sign = -1) => {
  const targetDate = new Date();
  const diffValue = sign * getRandomIntegerNumber(36000000);

  targetDate.setMinutes(targetDate.getMinutes() + diffValue);

  return targetDate;
};

export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

export const setShortDescription = (text, maxLength) => {
  let targetText = text;
  if (targetText.length > maxLength) {
    targetText = `${targetText.substr(0, maxLength)}...`;
  }
  return targetText;
};
