var UserMiddleware = (function () {

  /**
   * @param payload {Object}
   * @param userRepository {UserRepository}
   * @constructor
   */
  function UserMiddleware(payload, userRepository) {
    this.payload = payload;
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
    const chatId = this.payload.message.chat.id || null;
    const userFrom = this.payload.message.from || null;

    const replyToMessage = this.payload.message.reply_to_message || null;

    const userNewChatParticipant = this.payload.message.new_chat_participant || null;

    if (userFrom !== null) {
      createUserIfNotExist.call(this, chatId, userFrom);
    }

    if (replyToMessage !== null) {
      const userReplyToChatId = replyToMessage.chat.id || null;
      const userReplyTo = replyToMessage.from || null;
      createUserIfNotExist.call(this, userReplyToChatId, userReplyTo);
    }

    if (userNewChatParticipant !== null) {
      createUserIfNotExist.call(this, chatId, userNewChatParticipant);
    }
  };

  return UserMiddleware;
})();

