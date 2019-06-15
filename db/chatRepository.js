/**
 * @param ssid
 * @constructor
 */
function ChatRepository(ssid) {
  DB.call(this, ssid);
}

ChatRepository.prototype = Object.create(DB.prototype);
ChatRepository.prototype.constructor = ChatRepository;

/**
 * @param conditions
 * @returns {ChatDto}
 */
ChatRepository.prototype.find = function (conditions) {
  const value = this.findByCondition(conditions).one();
  return new ChatDto(value);
};

/**
 * @param chatDto
 * @returns {boolean}
 */
ChatRepository.prototype.create = function (chatDto) {
  if (!chatDto.chatId) {
    return false;
  }
  this.insert([chatDto.chatId, chatDto.maxDays, chatDto.maxMinutes, chatDto.updatedAt]);
  return true;
};

/**
 * @param chatDto
 * @returns {boolean}
 */
ChatRepository.prototype.edit = function (chatDto) {
  if (!chatDto.row) {
    return false;
  }
  const data = [chatDto.chatId, chatDto.maxDays, chatDto.maxMinutes, chatDto.updatedAt];
  this.update(data);
  return true;
};