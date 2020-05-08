import AbstractSmartComponent from "./abstract-smart-component";
import {EMOJI_NAMES} from "../const";
import {createCommentsTemplate} from "./comment";
import {formatDate} from "../utils/common";

const createGenresMarkup = (genres) => {
  const title = genres.length > 1 ? `Genres` : `Genre`;

  return (
    `<td class="film-details__term">${title}</td>
    <td class="film-details__cell">
      ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`)}
    </td >`
  );
};

const createAddEmojiMarkup = (emojiName) => {
  return emojiName ? `<img src="./images/emoji/${emojiName}.png" width="55" height="55" alt="emoji-${emojiName}">` : ``;
};

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

const createFilmDetailCardTemplate = (card, option) => {
  const {title, description, poster, age, commentCount, director, actors, writers, duration, country, dateRelease, rating, genres, commentList} = card;
  const {emojiName, isWatchlist, isWatched, isFavorite} = option;
  const date = formatDate(dateRelease);

  const emojiListMarkup = createEmojiListMarkup(emojiName);

  return (
    `<section class="film-details">
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
        <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? `checked` : ``}>
        <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
        <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

        <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
        <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
      </section>
    </div>

    <div class="form-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentCount}</span></h3>

        <ul class="film-details__comments-list">
        ${createCommentsTemplate(commentList)}
        </ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">${createAddEmojiMarkup(emojiName)}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
           ${emojiListMarkup}
          </div>
        </div>
      </section>
    </div>
  </form>
</section>`
  );
};

export default class CardDetail extends AbstractSmartComponent {
  constructor(card) {
    super();

    this._card = card;

    this._isWatchlist = this._card.isWatchlist;
    this._isWatched = this._card.isWatched;
    this._isFavorite = this._card.isFavorite;

    this._buttonCloseHandler = null;
    this._emojiName = ``;

    this._subscribeOnEvents();
  }

  getTemplate() {
    return createFilmDetailCardTemplate(this._card, {
      isWatchlist: this._isWatchlist,
      isWatched: this._isWatched,
      isFavorite: this._isFavorite,
      emojiName: this._emojiName,
    });
  }

  recoveryListeners() {
    this.setCloseDetailHandler(this._buttonCloseHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  setCloseDetailHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
    this._buttonCloseHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`#watchlist`)
      .addEventListener(`click`, () => {
        this._isWatchlist = !this._isWatchlist;

        this.rerender();
      });

    element.querySelector(`#watched`)
      .addEventListener(`click`, () => {
        this._isWatched = !this._isWatched;

        this.rerender();
      });

    element.querySelector(`#favorite`)
      .addEventListener(`click`, () => {
        this._isFavorite = !this._isFavorite;

        this.rerender();
      });

    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, (evt) => {
        this._emojiName = evt.target.value;

        this.rerender();
      });
  }
}
