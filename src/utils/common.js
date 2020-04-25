const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
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
