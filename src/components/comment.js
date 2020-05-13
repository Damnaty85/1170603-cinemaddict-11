const createCommentsMarkup = (commentData) => {
  const {id, emoji, commentText, author, date} = commentData;
  return (
    `<li class="film-details__comment" id="${id}">
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
    </li>`
  );
};

export const createCommentsTemplate = (comments) => {
  return comments.map((it) => createCommentsMarkup(it)).join(`\n`);
};
