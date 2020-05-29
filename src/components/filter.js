import AbstractComponent from "./abstract-component";
import {FilterType} from "../const";

const createFilterMarkup = (filterItem, isActive) => {
  const {name, count} = filterItem;
  const activeFilter = isActive ? ` main-navigation__item--active` : ``;
  return (`
  <a href="#${name === `all movies` ? name.slice(0, 3) : name}" id="${name === `all movies` ? name.slice(0, 3) : name}" class="main-navigation__item${activeFilter}">${name}${name === `All movies` ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>
  `);
};

const createFilterTemplate = (filters) => {
  const filterMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).slice(0, -1).join(`\n`);
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
            ${filterMarkup}
        </div>
        <a href="#stats" id="${FilterType.STATISTIC}" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {

    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName === `A`) {
        this.getElement().querySelector(`.main-navigation__item--active`)
          .classList.remove(`main-navigation__item--active`);

        evt.target.classList.add(`main-navigation__item--active`);

        const filter = evt.target.id;

        handler(filter);
      }
    });
  }
}
