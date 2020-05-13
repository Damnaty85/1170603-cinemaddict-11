import AbstractComponent from "./abstract-component";

const createFilterMarkup = (filterItem, isActive) => {
  const {name, count} = filterItem;
  const link = name.toLowerCase();
  const activeFilter = isActive ? ` main-navigation__item--active` : ``;
  return (`
  <a href="#${link === `all movies` ? link.slice(0, 3) : link}" class="main-navigation__item${activeFilter}">${name}${name === `All movies` ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>
  `);
};

const createFilterTemplate = (filters) => {
  const filterMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
            ${filterMarkup}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
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

      if (!evt.target.classList.contains(`main-navigation__item--additional`)) {
        this.getElement().querySelector(`.main-navigation__item--active`)
          .classList.remove(`main-navigation__item--active`);

        evt.target.classList.add(`main-navigation__item--active`);

        handler(evt.target.href);
      }
    });
  }
}
