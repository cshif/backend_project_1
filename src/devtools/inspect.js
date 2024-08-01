import util from 'node:util';

export default (...content) => {
  content.forEach((i) => {
    if (typeof i === 'string') {
      console.log(i);
    } else {
      console.log(util.inspect(i, false, null, true));
    }
  });
};
