import {generateCardControl} from "../mock/control";
import {generateTableCell} from "../mock/detail-table";

const createDetailTableMarkup = (cellData) => {
  const {cellName, cellValue} = cellData;

  return (`
    <tr class="film-details__row">
        <td class="film-details__term">${cellName}</td>
        <td class="film-details__cell">${cellValue}</td>
    </tr>
  `);
};

const createButtonCardControlMarkup = (buttonData, isChecked) => {
  const {nameDetail, controlClassDetail} = buttonData;
  isChecked = Math.random() > 0.5;

  return (`
    <input type="checkbox" class="film-details__control-input visually-hidden" id="${controlClassDetail}" name="${controlClassDetail}" ${isChecked ? `checked` : ``}>
    <label for="${controlClassDetail}" class="film-details__control-label film-details__control-label--${controlClassDetail}">${nameDetail}</label>
  `);
};

export const createFilmDetailCardTemplate = (card) => {
  const {title, description, poster, age, commentCount} = card;

  const cell = generateTableCell();
  const detailCell = cell.map((it) => createDetailTableMarkup(it)).join(`\n`);

  const control = generateCardControl();
  const buttonControl = control.map((it) => createButtonCardControlMarkup(it)).join(`\n`);

  return (`
     <form class="film-details__inner" action="" method="get">
    <div class="form-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

          <p class="film-details__age">${age}</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${title}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${card.rating}</p>
            </div>
          </div>

          <table class="film-details__table">
            ${detailCell}
          </table>

          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        ${buttonControl}
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentCount}</span></h3>

        <ul class="film-details__comments-list">
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label"></div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
  `);
};
