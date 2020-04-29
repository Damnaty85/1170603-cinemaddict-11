import AbstractComponent from "./abstract-component";

export const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

const createSortMarkup = (sort, isActive) => {
  const {name} = sort;
  return (
    `<li><a href="#" data-sort-type="${name}" class="sort__button${isActive ? ` sort__button--active` : ``}">Sort by ${name}</a></li>`
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

export default class Sort extends AbstractComponent {
  constructor(sorts) {
    super();
    this._sorts = sorts;
    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createMainSortTemplate(this._sorts);
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      this.getElement().querySelector(`.sort__button--active`).classList.remove(`sort__button--active`);

      evt.target.classList.add(`sort__button--active`);

      handler(this._currentSortType);
    });
  }
}
