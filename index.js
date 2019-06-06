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
  if(e.postData.type === "application/json") {
    const db = new DB(config.ssid);
    const payload = JSON.parse(e.postData.contents);
    const client = new TelegramClient(config.url, config.token, payload);
    const bus = new CmdBus();
    
    bus.on(/\/start/, function() {
      const chatId = this.payload.message.chat.id;
      var chatDto = db.find(chatId);
      if (!chatDto.chatId) {
        chatDto.chatId = chatId;
        chatDto.timestamp = moment().format(config.dateFormat);
        
        db.insert(chatDto);
        
        this.sendMessageChat("Счетчик дней без токса активирован!");
      } else {
        this.sendMessageChat("Счетчик уже активирован.");
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