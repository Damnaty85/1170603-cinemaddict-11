import {getRandomIntegerNumber} from "../utils";

export const createFooterStatisticTemplate = () => {
  return (`
    <p>${getRandomIntegerNumber(130291).toLocaleString(`ru-RU`)} movies inside</p>
  `);
};
