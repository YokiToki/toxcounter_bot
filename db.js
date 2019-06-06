/**
 * @param ssid
 * @constructor
 */
function DB(ssid) {
  this.spreadsheet = SpreadsheetApp.openById(ssid).getSheets()[0];
}

/**
 * @see https://developers.google.com/apps-script/reference/spreadsheet/sheet#getdatarange
 * @param id
 * @returns {ChatDto}
 */
DB.prototype.find = function (id) {
  const data = this.spreadsheet.getDataRange().getValues();
  const headers = data.shift();
  var value = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] === id) {
      value = data[i];
      value.unshift(i + 2);
      break;
    }
  }
  return new ChatDto(value);
};

/**
 * @see https://developers.google.com/apps-script/reference/spreadsheet/sheet#appendrowrowcontents
 * @param chatDto
 * @returns {boolean}
 */
DB.prototype.insert = function (chatDto) {
  if (!chatDto.chatId) {
    return false;
  }
  this.spreadsheet.appendRow([chatDto.chatId, chatDto.timestamp, chatDto.maxDays]);
  return true;
};

/**
 * @see https://developers.google.com/apps-script/reference/spreadsheet/sheet#getrangerow-column-numrows
 * @param chatDto
 * @returns {boolean}
 */
DB.prototype.update = function (chatDto) {
  if (!chatDto.row) {
    return false;
  }
  const data = [chatDto.chatId, chatDto.timestamp, chatDto.maxDays];
  this.spreadsheet.getRange(chatDto.row, 1, 1, data.length).setValues([data]);
  return true;
};