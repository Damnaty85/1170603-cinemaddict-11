export default class Comment {
  constructor(data) {
    this.id = data.id || null;
    this.author = data.author || null;
    this.comment = data.comment;
    this.date = data.date ? new Date(data.date) : null;
    this.emotion = data.emotion;
  }

  toRAW() {
    return {
      'comment': this.comment,
      'date': this.date,
      'emotion': this.emotion
    };
  }

  static parse(comment) {
    return new Comment(comment);
  }

  static parseAll(comment) {
    return comment.map(Comment.parse);
  }
}
