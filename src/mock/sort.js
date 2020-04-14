const sortNames = [`default`, `date`, `rating`];

const generateSorts = () => {
  return sortNames.map((it) => {
    return {
      name: it,
    };
  });
};

export {generateSorts};
