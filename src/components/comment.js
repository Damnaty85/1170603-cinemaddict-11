import {formatTime} from "../utils";

export const createCommentTemplate = (comment) => {
  const {emoji, commentText, author, commentDate} = comment;

  const date = commentDate.toLocaleDateString(`en-GB`);
  const time = formatTime(commentDate);

  return (`
    <li class="film-details__comment">
        <span class="film-details__comment-emoji">
            <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
        </span>
        <div>
            <p class="film-details__comment-text">${commentText}</p>
            <p class="film-details__comment-info">
                <span class="film-details__comment-author">${author}</span>
                <span class="film-details__comment-day">${date} ${time}</span>
                <button class="film-details__comment-delete">Delete</button>
            </p>
        </div>
    </li>
  `);
};
