var moment = Moment.load();

/**
 * Handle GET request to application
 * @returns {*}
 */
function doGet() {
  return ContentService.createTextOutput('Method not allowed.');
}

/**
 * Handle POST request to application
 * @param e
 */
function doPost(e) {
  if (e.postData.type === "application/json") {
    const db = new DB(config.ssid);
    const payload = JSON.parse(e.postData.contents);
    const client = new TelegramClient(config.url, config.token, payload);
    const bus = new CmdBus();

    bus.on(/\/start/, function () {
      const chatId = this.payload.message.chat.id;
      var chatDto = db.find(chatId);
      if (!chatDto.chatId) {
        chatDto.chatId = chatId;
        chatDto.timestamp = moment().format(config.dateTimeFormat);

        db.insert(chatDto);

        this.sendMessageChat(messages.active);
      } else {
        this.sendMessageChat(messages.alreadyActive);
      }
    });

    bus.on(/\/flush/, function () {
      const chatId = this.payload.message.chat.id;
      var chatDto = db.find(chatId);
      if (chatDto.chatId) {
        var timestamp = moment(chatDto.timestamp).zone('+0600').format(config.dateTimeFormat);
        var days = moment().diff(moment(timestamp, config.dateTimeFormat), 'days');
        var minutes = moment().diff(moment(timestamp, config.dateTimeFormat), 'minutes');

        chatDto.timestamp = moment(new Date()).format(config.dateTimeFormat);
        if (days > chatDto.maxDays) {
          chatDto.maxDays = days;
        }

        if (minutes > chatDto.maxMinutes) {
          chatDto.maxMinutes = minutes;
        }

        db.update(chatDto);

        this.sendStickerChat(config.stickerId);
      } else {
        this.sendMessageChat(messages.notActive);
      }
    });

    bus.on(/\/stat/, function () {
      const chatId = this.payload.message.chat.id;
      var chatDto = db.find(chatId);
      if (chatDto.chatId) {
        var timestamp = moment(chatDto.timestamp).zone('+0600').format(config.dateTimeFormat);
        var days = moment().diff(moment(timestamp, config.dateTimeFormat), 'days');
        var minutes = moment().diff(moment(timestamp, config.dateTimeFormat), 'minutes');
        var date = moment(timestamp, config.dateTimeFormat).format(config.dateFormat);

        this.sendMessageChat(messages.stat.format(days, minutes, chatDto.maxDays || days, chatDto.maxMinutes || minutes, date));
      } else {
        this.sendMessageChat(messages.notActive);
      }
    });

    bus.on(/\/help/, function () {
      this.sendMessageChat(messages.help);
    });

    client.register(bus);

    if (payload) {
      client.process();
    }
  }
}

/**
 * Manual actions to control webhook
 */
function getWebhookInfo() {
  const client = new TelegramClient(config.url, config.token, {});
  const response = client.getWebhookInfo();
  Logger.log(response);
}

function deleteWebhook() {
  const client = new TelegramClient(config.url, config.token, {});
  const response = client.deleteWebhook();
  Logger.log(response);
}

function setWebhook() {
  const client = new TelegramClient(config.url, config.token, {});
  const gUrl = ScriptApp.getService().getUrl();
  const response = client.setWebhook(gUrl);
  Logger.log(response);
}

function getUpdates() {
  const client = new TelegramClient(config.url, config.token, {});
  const response = client.getUpdates();
  Logger.log(response);
}