import AbstractComponent from "./abstract-component";

const createContentTemplate = () => {
  return (
    `<section class="films"></section>`
  );
};

export default class FilmsSection extends AbstractComponent {
  getTemplate() {
    return createContentTemplate();
  }
}
