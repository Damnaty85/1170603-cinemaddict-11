const generateCardControl = () => {
  return [{
    name: `Add to watchlist`,
    nameDetail: `Add to watchlist`,
    controlClass: `add-to-watchlist`,
    controlClassDetail: `watchlist`,
  }, {
    name: `Mark as watched`,
    nameDetail: `Already watched`,
    controlClass: `mark-as-watched`,
    controlClassDetail: `watched`,
  }, {
    name: `Mark as favorite`,
    nameDetail: `Mark as favorite`,
    controlClass: `favorite`,
    controlClassDetail: `favorite`
  }];
};

export {generateCardControl};
