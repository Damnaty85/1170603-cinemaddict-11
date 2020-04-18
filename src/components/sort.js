const createSortMarkup = (sort, isActive) => {
  const {name} = sort;
  return (`
  <li><a href="#" class="sort__button${isActive ? ` sort__button--active` : ``}">Sort by ${name}</a></li>
  `);
};

export const createMainSortTemplate = (sort) => {
  const sortMarkup = sort.map((it, i) => createSortMarkup(it, i === 0)).join(`\n`);
  return (`
    <ul class="sort">
        ${sortMarkup}
    </ul>
  `);
};
