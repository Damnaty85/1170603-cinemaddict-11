const navigationNames = [
  `All movies`, `Watchlist`, `History`, `Favorites`
];

const generateNavigations = () => {
  return navigationNames.map((it) => {
    return {
      name: it,
      count: Math.floor(Math.random() * 10),
      link: it === `All movies` ? navigationNames[0].slice(0, 3).toLowerCase() : it.toLowerCase(),
    };
  });
};

export {generateNavigations};
