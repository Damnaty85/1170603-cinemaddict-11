import AbstractComponent from "./abstract-component";

const createNoDataTemplate = () => {
  return (
    `<h2 class="films-list__title">There are no movies in our database</h2>`
  );
};


export default class NoData extends AbstractComponent {
  getTemplate() {
    return createNoDataTemplate();
  }
}
