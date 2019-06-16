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
  function createUserIfNotExist(chatId, user) {
    var userDto = this.userRepository.find({userId: user.id, chatId: chatId});
    if (userDto.row === null) {
      userDto.userId = user.id;
      userDto.chatId = chatId;
      userDto.username = user.username;
      userDto.firstName = user.first_name;
      userDto.lastName = user.last_name || null;
      userDto.isBot = user.is_bot;
      userDto.createdAt = moment().format(config.dateTimeFormat);

      this.userRepository.create(userDto);
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
        createUserIfNotExist.call(this, chatId, userFrom);
      }

      if (replyToMessage) {
        const userReplyToChat = replyToMessage.chat || null;
        const userReplyToChatId = userReplyToChat.id || null;
        const userReplyTo = replyToMessage.from || null;
        if (userReplyTo.username !== botInfo.result.username) {
          createUserIfNotExist.call(this, userReplyToChatId, userReplyTo);
        }
      }

      if (userNewChatParticipant && userNewChatParticipant.username !== botInfo.result.username) {
        createUserIfNotExist.call(this, chatId, userNewChatParticipant);
      }
    }
  };

  return UserMiddleware;
})();

