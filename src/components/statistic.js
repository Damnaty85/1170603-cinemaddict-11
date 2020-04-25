import AbstractComponent from "./abstract-component";

const createFooterStatisticTemplate = (count) => {
  return (
    `<p>${count.toLocaleString(`ru-RU`)} movies inside</p>`
  );
};

export default class Sort extends AbstractComponent {
  constructor(count) {
    super();

    this._count = count;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._count);
  }
}
