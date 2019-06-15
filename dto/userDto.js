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
  this.isBot = params[6] || null;
  this.createdAt = params[7] || null;
}