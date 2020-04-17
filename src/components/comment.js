import {generateComments} from "../mock/comment";

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

export const createFilterTemplate = (count) => {

  const comment = generateComments(count);
  const comments = comment.map((it) => createCommentsMarkup(it)).join(`\n`);

  return comments;
};
