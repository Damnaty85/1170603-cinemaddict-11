import moment from "moment";

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM Y`);
};

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
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
