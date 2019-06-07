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

        this.sendMessageChat("Счетчик дней без токса активирован!");
      } else {
        this.sendMessageChat("Счетчик уже активирован.");
      }
    });

    bus.on(/\/flush/, function () {
      const chatId = this.payload.message.chat.id;
      var chatDto = db.find(chatId);
      if (chatDto.chatId) {
        var timestamp = moment(chatDto.timestamp);
        var days = moment().diff(timestamp, 'days');

        chatDto.timestamp = moment().format(config.dateTimeFormat);
        if (days > chatDto.maxDays) {
          chatDto.maxDays = days;
        }

        db.update(chatDto);

        this.sendStickerChat(config.stickerId);
      } else {
        this.sendMessageChat("Счетчик не активирован в этом чате.");
      }
    });

    bus.on(/\/stat/, function () {
      const chatId = this.payload.message.chat.id;
      var chatDto = db.find(chatId);
      if (chatDto.chatId) {
        var days = moment().diff(chatDto.timestamp, 'days');
        var date = moment(chatDto.timestamp).format(config.dateFormat);

        this.sendMessageChat("Дней без токса: "+ days +"\nМакс. дней без токса: "+ chatDto.maxDays +"\nДата последнего токса: " + date);
      } else {
        this.sendMessageChat("Счетчик не активирован в этом чате.");
      }
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