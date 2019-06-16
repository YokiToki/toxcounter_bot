/**
 * @param ssid
 * @constructor
 */
function DB(ssid) {
  this.spreadsheet = SpreadsheetApp.openById(ssid).getSheets()[0];
  this.headers = null;
  this.data = null;
}

/**
 * @returns {DB}
 */
DB.prototype.select = function () {
  const data = this.spreadsheet.getDataRange().getValues();
  this.headers = data.shift();
  this.data = data;
  return this;
};

/**
 * @see https://developers.google.com/apps-script/reference/spreadsheet/sheet#getdatarange
 * @param conditions Object
 * @returns {DB}
 */
DB.prototype.findByCondition = function (conditions) {
  this.select();
  this.data = this.data.reduce((function (filtered, row, i) {
    var columns = Object.keys(conditions);
    for (var j = 0; j < columns.length; j++) {
      var column = columns[j];
      var columnIndex = this.headers.indexOf(column);
      if (columnIndex === -1) {
        return filtered;
      }
      if ((row[columnIndex]).toString() !== (conditions[column]).toString()) {
        return filtered;
      }
    }
    row.unshift(i + 2);
    filtered.push(row);

    return filtered;
  }).bind(this), []);

  return this;
};

/**
 * @returns {Array}
 */
DB.prototype.all = function () {
  return this.data || [];
};

/**
 * @returns {null|Array}
 */
DB.prototype.one = function () {
  if (this.data === null || this.data.length < 1) {
    return [];
  }
  return this.data.shift();
};

/**
 * @see https://developers.google.com/apps-script/reference/spreadsheet/sheet#appendrowrowcontents
 * @param data {Array}
 */
DB.prototype.insert = function (data) {
  this.spreadsheet.appendRow(data);
  return this;
};

/**
 * @see https://developers.google.com/apps-script/reference/spreadsheet/sheet#getrangerow-column-numrows
 * @param row {Number}
 * @param data {Array}
 * @returns {DB}
 */
DB.prototype.update = function (row, data) {
  this.spreadsheet.getRange(row, 1, 1, data.length).setValues([data]);
  return this;
};