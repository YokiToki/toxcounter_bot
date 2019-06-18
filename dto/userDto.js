/**
 * @param params
 * @constructor
 */
function UserDto(params) {
  this.row = params[0] || null;
  this.userId = params[1] || null;
  this.chatId = params[2] || null;
  this.username = params[3] || null;
  this.firstName = params[4] || null;
  this.lastName = params[5] || null;
  this.isBot = params[6] || false;
  this.toxCount = params[7] || null;
  this.createdAt = params[8] || null;
}

/**
 * @returns {int}
 */
UserDto.prototype.getToxCount = function () {
  return parseInt(this.toxCount) || 0
};

/**
 * @returns {string}
 */
UserDto.prototype.getFullName = function () {
  return [this.firstName, this.lastName].filter(function (value) {
    return value;
  }).join(' ');
};