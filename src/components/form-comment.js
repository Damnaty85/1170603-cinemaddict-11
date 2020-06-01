import AbstractSmartComponent from "./abstract-smart-component";
import {EMOJI_NAMES} from "../const";

const createEmojiListMarkup = (emojiName) => {
  return EMOJI_NAMES.map((name) => {
    const isChecked = emojiName === name;
    return (
      `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${name}" value="${name}" ${isChecked ? `checked` : ``}>
        <label class="film-details__emoji-label" for="emoji-${name}">
            <img src="./images/emoji/${name}.png" width="30" height="30" alt="emoji">
        </label>`
    );
  }).join(`\n`);
};

const createFormCommentMarkup = () => {
  const emojiListMarkup = createEmojiListMarkup();
  return (
    `<div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>
          <span class="film-details__comment__error">Choose an emotion and fill in the field below</span>
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
           ${emojiListMarkup}
         </div>
     </div>`
  );
};

export default class FormComment extends AbstractSmartComponent {
  constructor() {
    super();

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFormCommentMarkup();
  }

  getAddCommentFormData() {
    const form = this.getElement().closest(`.film-details__inner`);
    return new FormData(form);
  }

  setCommentSubmitHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-input`)
      .addEventListener(`keydown`, (evt) => {
        const ctrlOrCommandKey = evt.ctrlKey || evt.metaKey;
        const enterKey = evt.key === `Enter`;

        if (ctrlOrCommandKey && enterKey) {
          handler();
        }
      });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, function (evt) {
        if (evt.target.tagName !== `INPUT`) {
          return;
        }

        const emotionContainer = element.querySelector(`.film-details__add-emoji-label`);
        const selectedEmotion = evt.target.value;

        emotionContainer.innerHTML = `<img src="./images/emoji/${selectedEmotion}.png" width="55" height="55" alt="emoji">`;
      });
  }

  blockInput(toBLock) {
    const inputs = this.getElement().querySelectorAll(`input, textarea`);

    inputs.forEach((input) => {
      input.disabled = toBLock;
    });
  }

  resetForm() {
    this.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = ``;
    this.getElement().querySelector(`.film-details__comment-input`).value = ``;
  }
}
