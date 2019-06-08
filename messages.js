if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
        ;
    });
  };
}

var messages = {
  help: "/start Активировать бота в чате.\n/flush Сбросить счетчик.\n/stat Отобразить статистику чата.\n/help показать это сообщение.",
  stat: "Дней без токса: {0}\nМакс. дней без токса: {1}\nДата последнего токса: {2}",
  active: "Счетчик дней без токса активирован!",
  notActive: "Счетчик не активирован в этом чате.",
  alreadyActive: "Счетчик уже активирован.",
};