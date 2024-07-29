const filterNullValues = (data) => {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value != null)
  );
};

export default filterNullValues;
