/**
 * @param params
 * @constructor
 */
function ChatDto(params) {
  this.row = params[0] || null;
  this.chatId = params[1] || null;
  this.maxDays = params[2] || 0;
  this.maxMinutes = params[3] || 0;
  this.updatedAt = params[4] || null;
}
