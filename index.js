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
    const chatRepository = new ChatRepository(config.chatDataSsid);
    const userRepository = new UserRepository(config.userDataSsid);
    const payload = JSON.parse(e.postData.contents);
    const client = new TelegramClient(config.url, config.token, payload);
    const bus = new CmdBus();
    const userMiddleware = new UserMiddleware(client, userRepository);

    userMiddleware.handle();

    bus.on(/\/start/, function () {
      const chatId = this.payload.message.chat.id;
      var chatDto = chatRepository.find({chatId: chatId});
      if (!chatDto.chatId) {
        chatDto.chatId = chatId;
        chatDto.updatedAt = moment().format(config.dateTimeFormat);

        chatRepository.create(chatDto);

        this.sendMessageChat(messages.active);
      } else {
        this.sendMessageChat(messages.alreadyActive);
      }
    });

    bus.on(/\/flush/, function () {
      const chatId = this.payload.message.chat.id;
      const userFrom = this.payload.message.from;
      const replyToMessage = this.payload.message.reply_to_message || null;
      const botInfo = this.getMe();
      var chatDto = chatRepository.find({chatId: chatId});

      if (chatDto.chatId) {
        var timestamp = moment(chatDto.updatedAt).zone('+0600').format(config.dateTimeFormat);
        var days = moment().diff(moment(timestamp, config.dateTimeFormat), 'days');
        var minutes = moment().diff(moment(timestamp, config.dateTimeFormat), 'minutes');

        chatDto.updatedAt = moment(new Date()).format(config.dateTimeFormat);
        if (days > chatDto.maxDays) {
          chatDto.maxDays = days;
        }

        if (minutes > chatDto.maxMinutes) {
          chatDto.maxMinutes = minutes;
        }

        if (replyToMessage && replyToMessage.from.username !== botInfo.result.username) {
          const lastToxUserDto = userRepository.find({chatId: chatId, userId: replyToMessage.from.id});
          if (lastToxUserDto.row !== null) {
            var toxCount = lastToxUserDto.getToxCount();
            lastToxUserDto.toxCount = ++toxCount;
            userRepository.edit(lastToxUserDto);
          }
          chatDto.userLastToxId = replyToMessage.from.id;
        }

        chatDto.userLastFlushId = userFrom.id;

        chatRepository.edit(chatDto);

        this.sendStickerChat(config.stickerId);
      } else {
        this.sendMessageChat(messages.notActive);
      }
    });

    bus.on(/\/stat/, function () {
      const chatId = this.payload.message.chat.id;
      var chatDto = chatRepository.find({chatId: chatId});

      if (chatDto.chatId) {
        var lastFlushUser = messages.userNotAvailable;
        var lastToxUser = messages.userNotAvailable;
        var timestamp = moment(chatDto.updatedAt).zone('+0600').format(config.dateTimeFormat);
        var days = moment().diff(moment(timestamp, config.dateTimeFormat), 'days');
        var minutes = moment().diff(moment(timestamp, config.dateTimeFormat), 'minutes');
        var date = moment(timestamp, config.dateTimeFormat).format(config.dateFormat);
        if (chatDto.userLastFlushId) {
          const lastFlushUserDto = userRepository.find({userId: chatDto.userLastFlushId});
          if (lastFlushUserDto.row !== null) {
            lastFlushUser = lastFlushUserDto.getChatUsername();
          }
        }
        if (chatDto.userLastToxId) {
          const lastToxUserDto = userRepository.find({userId: chatDto.userLastToxId});
          if (lastToxUserDto.row !== null) {
            lastToxUser = lastToxUserDto.getChatUsername();
          }
        } else if (lastFlushUser !== messages.userNotAvailable) {
          lastToxUser = messages.userToxNotAvailable.format(lastFlushUser);
        }

        this.sendMessageChat(messages.stat.format(days, minutes, chatDto.maxDays || days, chatDto.maxMinutes || minutes, date, lastFlushUser, lastToxUser));
      } else {
        this.sendMessageChat(messages.notActive);
      }
    });

    bus.on(/\/tox(\S+)? ?(\S+)?/, function (bot, mention) {
      const chatId = this.payload.message.chat.id;
      const userFrom = this.payload.message.from;
      const botInfo = this.getMe();

      var userDto = mention !== undefined ?
        userRepository.find({username: mention.replace('@', '')}) :
        userRepository.getRandom(chatId);

      if (userDto.username === botInfo.result.username) {
        userDto = userRepository.find({username: userFrom.username});
      }

      if (userDto.row === null) {
        this.sendMessageChat(messages.userNotActive, userFrom.username);
        return;
      }

      const response = this.getChatMember(chatId, userDto.userId);

      if (response === null) {
        this.sendMessageChat(messages.userNotFound, userFrom.username);
        return;
      }

      const toxService = new ToxService(
        messages.tox.appeals,
        messages.tox.bodies,
        messages.tox.swearWords,
        messages.tox.conclusions
      );

      this.sendMessageChat(toxService.get(userDto.username), userDto.username);
    });

    bus.on(/\/top/, function () {
      const chatId = this.payload.message.chat.id;
      var topMessage = messages.topTitle;
      const userDtoList = userRepository.getListOrderBy(chatId, 'toxCount', 'DESC');
      for (var i in userDtoList) {
        var userDto = userDtoList[i];
        topMessage += messages.topTemplate.format(parseInt(i)+1, userDto.firstName, userDto.lastName, userDto.getChatUsername(), userDto.getToxCount());
      }

      this.sendMessageChat(topMessage);
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