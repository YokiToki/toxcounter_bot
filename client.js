/**
 * @param url
 * @param token
 * @param payload
 * @constructor
 */
function TelegramClient(url, token, payload) {
  this.url = url;
  this.token = token;
  this.payload = payload;
  this.handlers = [];
  Logger.log(payload);
}

/**
 * @param handler
 */
TelegramClient.prototype.register = function (handler) {
  this.handlers.push(handler);
};

/**
 *
 */
TelegramClient.prototype.process = function () {
  for (var i in this.handlers) {
    var event = this.handlers[i];
    var result = event.condition(this);
    if (result) {
      return event.handle(this);
    }
  }
};

TelegramClient.prototype.request = function (method, data) {
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(data)
  };

  var response = UrlFetchApp.fetch(this.url + this.token + '/' + method, options);

  if (response.getResponseCode() == 200) {
    return JSON.parse(response.getContentText());
  }

  return false;
}

/**
 * @see https://core.telegram.org/bots/api#sendmessage
 */
TelegramClient.prototype.sendMessage = function (text) {
  return this.request('sendMessage', {
    'chat_id': this.payload.message.from.id,
    'text': text
  });
}

/**
 * @see https://core.telegram.org/bots/api#sendmessage
 */
TelegramClient.prototype.sendMessageChat = function (text) {
  return this.request('sendMessage', {
    'chat_id': this.payload.message.chat.id,
    'text': text
  });
}

/**
 * @see https://core.telegram.org/bots/api#getwebhookinfo
 */
TelegramClient.prototype.getWebhookInfo = function () {
  return this.request('getWebhookInfo', {});
}

/**
 * @see https://core.telegram.org/bots/api#setwebhook
 */
TelegramClient.prototype.setWebhook = function (url) {
  return this.request('setWebhook', {url: url});
}

/**
 * @see https://core.telegram.org/bots/api#deletewebhook
 */
TelegramClient.prototype.deleteWebhook = function () {
  return this.request('deleteWebhook', {});
}
