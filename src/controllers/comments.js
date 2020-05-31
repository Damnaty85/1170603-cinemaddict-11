import CommentsComponent from "../components/comment";
import FormCommentComponent from "../components/form-comment";
import {render, replace, RenderPosition} from "../utils/render";
import CommentModel from "../models/comment";
import he from "he";

const parseFormData = (formData) => {
  return new CommentModel({
    'comment': he.encode(formData.get(`comment`)),
    'date': new Date().toISOString(),
    'emotion': formData.get(`comment-emoji`),
  });
};

export default class CommentController {
  constructor(container, card, api) {
    this._container = container;
    this._card = card;

    this._api = api;
    this._shake = null;
    this._updateFilmCardHandler = null;
    this._commentsComponent = null;
    this._comments = null;
    this._formCommentComponent = null;
    this._addCommentFormTextField = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._setCommentDelete = this._setCommentDelete.bind(this);
  }

  set shake(handler) {
    this._shake = handler;
  }

  onCommentsCountChangeHandler(handler) {
    this._updateFilmCardHandler = handler;
  }

  render(comments) {
    const container = this._container;
    const oldComponent = this._commentsComponent;

    this._comments = comments;
    this._commentsComponent = new CommentsComponent(this._comments);

    this._commentsComponent.setCommentsDeleteClickHandler((commentId) => {
      this._commentsComponent.setDeleteButtonText(commentId, `Deleting...`);
      this._blockDeleteButton(commentId, true);
      this._setCommentDelete(commentId);
    });


    if (oldComponent) {
      replace(this._commentsComponent, oldComponent);
    } else {
      render(container, this._commentsComponent, RenderPosition.AFTERBEGIN);
    }
  }

  renderCommentForm() {
    const container = this._container;
    const oldComponent = this._formCommentComponent;

    this._formCommentComponent = new FormCommentComponent();
    this._addCommentFormTextField = this._formCommentComponent.getElement();

    this._formCommentComponent.setCommentSubmitHandler(() => {
      const formData = this._formCommentComponent.getAddCommentFormData();
      const newComment = parseFormData(formData);
      const isCommentValid = this._validateComment(newComment);

      if (!isCommentValid) {
        this._addCommentFormTextField.classList.add(`_invalid`);

        return;
      }

      this._addCommentFormTextField.classList.remove(`_invalid`);

      this._formCommentComponent.blockInput(true);

      this._api.createComment(this._card.id, newComment)
        .then(() => {
          this._formCommentComponent.resetForm();

          if (this._updateFilmCardHandler !== null) {
            this._updateFilmCardHandler(this._card);
          }

          this._formCommentComponent.blockInput(false);
        })
        .catch(() => {
          if (this._shake !== null) {
            this._shake();
            this._formCommentComponent.blockInput(false);
          }
        });
    });

    if (oldComponent) {
      replace(this._formCommentComponent, oldComponent);
    } else {
      render(container, this._formCommentComponent, RenderPosition.BEFOREEND);
    }
  }

  _onDataChange() {
    this.render(this._comments);
  }

  _blockDeleteButton(commentId, toBLock) {
    const button = this._commentsComponent.getElement().querySelector(`button[data-id="${commentId}"]`);

    if (!button) {
      return;
    }

    button.disabled = !!toBLock;
  }

  _setCommentDelete(commentId) {
    this._api.deleteComment(commentId)
      .then(() => {
        this._comments = this._comments.filter((it) => it.id !== commentId);
        this._onDataChange();

        if (this._updateFilmCardHandler !== null) {
          this._updateFilmCardHandler(this._card);
        }
      })
      .then(() => {
        this.loadComments(this._card.id);
      })
      .catch(() => {
        this._commentsComponent.setDeleteButtonText(commentId, `delete`);
        this._blockDeleteButton(commentId, false);
      });
  }

  _validateComment({emotion, comment}) {
    return !!emotion && !!comment;
  }

  loadComments(movieId) {
    this._api.getComments(movieId)
      .then((comments) => {
        this.render(comments);
      });
  }
}
