export const createFilmsListTemplate = (extra = ``, title = `Top rated`) => {
  return (`
    <section class="films-list${extra}">
        ${extra ? `<h2 class="films-list__title">${title}</h2>` : ``}
        <div class="films-list__container"></div>
    </section>
  `);
};
