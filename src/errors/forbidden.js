export default class Forbiddenerror extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}
