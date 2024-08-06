class Day {
  constructor() {}

  /**
   * @param {number} unixMs
   * @returns {string}
   */
  static toISOString(unixMs) {
    return new Date(unixMs).toISOString();
  }
}

export default Day;
