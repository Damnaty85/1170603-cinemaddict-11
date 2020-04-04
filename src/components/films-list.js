export const createFilmsListTemplate = (extra = ``) => {
  return (`
    <section class="films-list${extra}">
        <div class="films-list__container"></div>
    </section>
  `);
};
