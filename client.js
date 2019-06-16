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

/**
 * @param method
 * @param data
 * @returns {null|string}
 */
TelegramClient.prototype.request = function (method, data) {
  var options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(data),
    muteHttpExceptions: true,
  };

  try {
    var response = UrlFetchApp.fetch(this.url + this.token + '/' + method, options);
  } catch (e) {
    console.warn(e);
    return null;
  }

  if (response.getResponseCode() === 200) {
    return JSON.parse(response.getContentText());
  }

  return null;
};

/**
 * @see https://core.telegram.org/bots/api#sendmessage
 * @param text
 * @returns {boolean|string}
 */
TelegramClient.prototype.sendMessage = function (text) {
  return this.request('sendMessage', {
    'chat_id': this.payload.message.from.id,
    'text': text
  });
};

/**
 * @see https://core.telegram.org/bots/api#sendmessage
 * @param text
 * @param username
 * @returns {boolean|string}
 */
TelegramClient.prototype.sendMessageChat = function (text, username) {
  var data = {
    'chat_id': this.payload.message.chat.id,
    'text': text
  };
  if (username !== undefined) {
    data.entities = ['mention(' + username +')'];
  }
  return this.request('sendMessage', data);
};

/**
 * @see https://core.telegram.org/bots/api#sendsticker
 * @param sticker
 * @returns {boolean|string}
 */
TelegramClient.prototype.sendStickerChat = function (sticker) {
  return this.request('sendSticker', {
    'chat_id': this.payload.message.chat.id,
    'sticker': sticker
  });
};

/**
 * @see https://core.telegram.org/bots/api#getme
 * @returns {boolean|string}
 */
TelegramClient.prototype.getMe = function () {
  return this.request('getMe', {});
};

/**
 * @see https://core.telegram.org/bots/api#getchatmemberscount
 * @param chatId
 * @returns {boolean|string}
 */
TelegramClient.prototype.getChatMembersCount = function (chatId) {
  return this.request('getChatMembersCount', {
    'chat_id': chatId,
  });
};

/**
 * @see https://core.telegram.org/bots/api#getchatmember
 * @param chatId
 * @param userId
 * @returns {boolean|string}
 */
TelegramClient.prototype.getChatMember = function (chatId, userId) {
  return this.request('getChatMember', {
    'chat_id': chatId,
    'user_id': userId,
  });
};

/**
 * @see https://core.telegram.org/bots/api#getwebhookinfo
 * @returns {boolean|string}
 */
TelegramClient.prototype.getWebhookInfo = function () {
  return this.request('getWebhookInfo', {});
};

/**
 * @see https://core.telegram.org/bots/api#setwebhook
 * @param url
 * @returns {boolean|string}
 */
TelegramClient.prototype.setWebhook = function (url) {
  return this.request('setWebhook', {url: url});
};

/**
 * @see https://core.telegram.org/bots/api#deletewebhook
 * @returns {boolean|string}
 */
TelegramClient.prototype.deleteWebhook = function () {
  return this.request('deleteWebhook', {});
};

/**
 * @see https://core.telegram.org/bots/api#getupdates
 * @returns {boolean|string}
 */
TelegramClient.prototype.getUpdates = function () {
  return this.request('getUpdates', {});
};
