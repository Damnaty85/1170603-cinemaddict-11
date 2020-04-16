import {generateCardControl} from "../mock/control";
import {generateComments} from "../mock/comment";
import {MONTH_NAMES} from "../const";

const createGenresMarkup = (genres) => {
  const title = genres.length > 1 ? `Genres` : `Genre`;

  return (
    `<td class="film-details__term">${title}</td>
    <td class="film-details__cell">
      ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`)}
    </td >`
  );
};

const createButtonCardControlMarkup = (buttonData, isChecked) => {
  const {nameDetail, controlClassDetail} = buttonData;
  isChecked = Math.random() > 0.5;

  return (`
    <input type="checkbox" class="film-details__control-input visually-hidden" id="${controlClassDetail}" name="${controlClassDetail}" ${isChecked ? `checked` : ``}>
    <label for="${controlClassDetail}" class="film-details__control-label film-details__control-label--${controlClassDetail}">${nameDetail}</label>
  `);
};

const createCommentsMarkup = (commentData) => {
  const {emoji, commentText, author, date} = commentData;
  return (`
    <li class="film-details__comment">
        <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
        </span>
        <div>
            <p class="film-details__comment-text">${commentText}</p>
            <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${date}</span>
                <button class="film-details__comment-delete">Delete</button>
            </p>
        </div>
    </li>
  `);
};

export const createFilmDetailCardTemplate = (card) => {
  const {title, description, poster, age, commentCount, director, actors, writers, duration, country, dateRelease, rating, genres} = card;

  const date = `${dateRelease.getDate()} ${MONTH_NAMES[dateRelease.getMonth()]} ${dateRelease.getFullYear()}`;

  const control = generateCardControl();
  const filmControls = control.map((it) => createButtonCardControlMarkup(it)).join(`\n`);

  const comment = generateComments(commentCount);
  const comments = comment.map((it) => createCommentsMarkup(it)).join(`\n`);

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
              <p class="film-details__total-rating">${rating}</p>
            </div>
          </div>

          <table class="film-details__table">
                <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${date}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  ${createGenresMarkup(genres)}
                </tr>
              </table>
          </table>

          <p class="film-details__film-description">
          ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        ${filmControls}
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentCount}</span></h3>

        <ul class="film-details__comments-list">
        ${comments}
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
