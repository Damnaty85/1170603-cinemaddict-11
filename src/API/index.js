import CardModel from "../models/card";
import CommentModel from "../models/comment";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {

    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getCards() {
    return this._load({
      url: `movies`
    })
      .then(checkStatus)
      .then((response) => response.json())
      .then(CardModel.parseAll);
  }

  getComments(movieId) {
    return this._load({url: `comments/${movieId}`})
      .then((response) => response.json())
      .then(CommentModel.parseAll);
  }

  createComment(movieId, comment) {
    return this._load({
      url: `comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(comment.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(CommentModel.parse);
  }

  deleteComment(id) {
    return this._load({
      url: `comments/${id}`,
      method: Method.DELETE
    });
  }

  updateCard(movieId, data) {
    return this._load({
      url: `movies/${movieId}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json())
      .then(CardModel.parse);
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
}
