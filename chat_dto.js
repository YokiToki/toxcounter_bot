/**
 * @param params
 * @constructor
 */
function ChatDto(params) {
  this.row = params[0] || null;
  this.chatId = params[1] || null;
  this.timestamp = params[2] || null;
  this.maxDays = params[3] || 0;
  this.maxMinutes = params[4] || 0;
}
