import {createElement} from "../utils";

const createFooterStatisticTemplate = (count) => {
  return (
    `<p>${count.toLocaleString(`ru-RU`)} movies inside</p>`
  );
};

export default class Statistic {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
