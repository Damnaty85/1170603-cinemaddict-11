import {createElement} from "../utils";

const createSortMarkup = (sort, isActive) => {
  const {name} = sort;
  return (
    `<li><a href="#" class="sort__button${isActive ? ` sort__button--active` : ``}">Sort by ${name}</a></li>`
  );
};

const createMainSortTemplate = (sort) => {
  const sortMarkup = sort.map((it, i) => createSortMarkup(it, i === 0)).join(`\n`);
  return (
    `<ul class="sort">
        ${sortMarkup}
    </ul>`
  );
};


export default class Sort {
  constructor(sort) {
    this._sorts = sort;
    this._element = null;
  }

  getTemplate() {
    return createMainSortTemplate(this._sorts);
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
