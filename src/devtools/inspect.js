import util from 'node:util';

export default (...content) => {
  content.forEach((i) => {
    if (typeof i === 'string') {
      console.error(i);
    } else {
      console.error(util.inspect(i, false, null, true));
    }
  });
};
