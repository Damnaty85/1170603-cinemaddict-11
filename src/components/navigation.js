import AbstractComponent from "./abstract-component";

const createNavigationMarkup = (navItem, isActive) => {
  const {link, name, count} = navItem;
  return (`
  <a href="#${link}" class="main-navigation__item${isActive ? ` main-navigation__item--active` : ``}">${name}${name === `All movies` ? `` : `<span class="main-navigation__item-count">${count}</span>`}</a>
  `);
};

const createMainNavigationTemplate = (navigation) => {
  const navigationMarkup = navigation.map((it, i) => createNavigationMarkup(it, i === 0)).join(`\n`);
  return (
    `<nav class="main-navigation">
        <div class="main-navigation__items">
            ${navigationMarkup}
        </div>
        <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class NavigationMenu extends AbstractComponent {
  constructor(navigation) {
    super();

    this._navigations = navigation;
  }

  getTemplate() {
    return createMainNavigationTemplate(this._navigations);
  }
}
