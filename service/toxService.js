var ToxService = (function () {
  /**
   * @param appeals
   * @param bodies
   * @param swearWords
   * @param conclusions
   * @constructor
   */
  function ToxService(appeals, bodies, swearWords, conclusions) {
    this.appeals = appeals;
    this.bodies = bodies;
    this.swearWords = swearWords;
    this.conclusions = conclusions;
  }

  /**
   * @param array
   * @returns {*}
   */
  function getRandomValue(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * @returns {boolean}
   */
  function getRandomBool() {
    return Math.random() >= 0.5;
  }

  /**
   * @param string
   * @returns {string}
   */
  function randomReplaceChar(string) {
    if (getRandomBool()) {
      return string.replace('ь', 'б');
    }
    return string;
  }

  /**
   * @param username
   * @returns {string}
   */
  ToxService.prototype.get = function (username) {
    const appeal = randomReplaceChar.call(this, getRandomValue(this.appeals));
    const body = randomReplaceChar.call(this, getRandomValue(this.bodies));
    const swearWord = randomReplaceChar.call(this, getRandomValue(this.swearWords));
    const conclusion = randomReplaceChar.call(this, getRandomValue(this.conclusions));
    return [appeal, '@' + username + ',', body, swearWord, conclusion].join(' ');
  };

  return ToxService;
})();
