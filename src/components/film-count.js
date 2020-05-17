import AbstractComponent from "./abstract-component";

const createFooterFilmCountTemplate = (count) => {
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
    return createFooterFilmCountTemplate(this._count);
  }
}
