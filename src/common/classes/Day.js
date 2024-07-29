class Day {
  constructor() {}

  static toISOString(unixMs) {
    return new Date(unixMs).toISOString();
  }
}

export default Day;
