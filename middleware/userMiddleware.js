var UserMiddleware = (function () {

  /**
   * @param client {TelegramClient}
   * @param userRepository {UserRepository}
   * @constructor
   */
  function UserMiddleware(client, userRepository) {
    this.client = client;
    this.payload = client.payload;
    this.userRepository = userRepository;
  }

  /**
   * @param chatId
   * @param user
   */
  function creatOrUpdate(chatId, user) {
    var userDto = this.userRepository.find({userId: user.id, chatId: chatId});
    var username = user.username || null;
    var firstName = user.first_name || null;
    var lastName = user.last_name || null;

    if (userDto.row === null) {
      userDto.userId = user.id;
      userDto.chatId = chatId;
      userDto.username = username;
      userDto.firstName = firstName;
      userDto.lastName = lastName;
      userDto.isBot = user.is_bot;
      userDto.createdAt = moment().format(config.dateTimeFormat);

      this.userRepository.create(userDto);
    } else if (userDto.username !== username || userDto.firstName !== firstName || userDto.lastName !== lastName) {
      userDto.username = username;
      userDto.firstName = firstName;
      userDto.lastName = lastName;

      this.userRepository.edit(userDto);
    }
  }

  /**
   * Handle post request before command
   */
  UserMiddleware.prototype.handle = function () {
    const message = this.payload.message || null;
    if (message) {
      const botInfo = this.client.getMe();
      const chat = message.chat || null;
      const chatId = chat.id || null;
      const userFrom = message.from || null;
      const replyToMessage = message.reply_to_message || null;

      const userNewChatParticipant = message.new_chat_participant || null;

      if (userFrom && userFrom.username !== botInfo.result.username) {
        creatOrUpdate.call(this, chatId, userFrom);
      }

      if (replyToMessage) {
        const userReplyToChat = replyToMessage.chat || null;
        const userReplyToChatId = userReplyToChat.id || null;
        const userReplyTo = replyToMessage.from || null;
        if (userReplyTo.username !== botInfo.result.username) {
          creatOrUpdate.call(this, userReplyToChatId, userReplyTo);
        }
      }

      if (userNewChatParticipant && userNewChatParticipant.username !== botInfo.result.username) {
        creatOrUpdate.call(this, chatId, userNewChatParticipant);
      }
    }
  };

  return UserMiddleware;
})();

