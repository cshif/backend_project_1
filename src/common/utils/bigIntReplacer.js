export default (key, value) => {
  return typeof value === 'bigint' ? value.toString() : value;
};
