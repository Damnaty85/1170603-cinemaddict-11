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
  return moment.utc().to(date);
};

export const formatRuntime = (number) => {
  return moment.duration(number, `minute`).format(`h[h] mm[m]`);
};

export const setShortDescription = (text, maxLength) => {
  let targetText = text;
  if (targetText.length > maxLength) {
    targetText = `${targetText.substr(0, maxLength)}...`;
  }
  return targetText;
};
