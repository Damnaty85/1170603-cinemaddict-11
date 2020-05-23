import API from '../api';
import CommentsComponent from "../components/comment";
import FormCommentComponent from "../components/form-comment";
import {render, replace, RenderPosition} from "../utils/render";
import CommentModel from "../models/comment";
import he from "he";

const parseFormData = (formData) => {
  return new CommentModel({
    'author': `you`,
    'comment': he.encode(formData.get(`comment`)),
    'date': new Date().toISOString(),
    'emotion': formData.get(`comment-emoji`),
  });
};

export default class CommentController {
  constructor(container, card) {
    this._container = container;
    this._card = card;

    this._api = new API();
    this._updateFilmCardHandler = null;
    this._commentsComponent = null;
    this._comments = null;
    this._formCommentComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._setCommentDelete = this._setCommentDelete.bind(this);
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

    this._formCommentComponent.setCommentSubmitHandler(() => {
      const formData = this._formCommentComponent.getAddCommentFormData();
      const newComment = parseFormData(formData);

      this._formCommentComponent.blockInput(true);

      this._api.createComment(this._card.id, newComment)
        .then(() => {
          this._formCommentComponent.resetForm();

          if (this._updateFilmCardHandler !== null) {
            this._updateFilmCardHandler(this._card);
          }

          this._formCommentComponent.blockInput(false);
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

    button.disabled = toBLock ? true : false;
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

  loadComments(movieId) {
    this._api.getComments(movieId)
      .then((comments) => {
        this.render(comments);
      });
  }
}
