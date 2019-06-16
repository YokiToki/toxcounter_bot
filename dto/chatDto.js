/**
 * @param params
 * @constructor
 */
function ChatDto(params) {
  this.row = params[0] || null;
  this.chatId = params[1] || null;
  this.userLastToxId = params[2] || null;
  this.userLastFlushId = params[3] || null;
  this.maxDays = params[4] || 0;
  this.maxMinutes = params[5] || 0;
  this.updatedAt = params[6] || null;
}
