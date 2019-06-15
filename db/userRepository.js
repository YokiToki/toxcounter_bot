/**
 * @param ssid
 * @constructor
 */
function UserRepository(ssid) {
  DB.call(this, ssid);
}

UserRepository.prototype = Object.create(DB.prototype);
UserRepository.prototype.constructor = UserRepository;

/**
 * @param conditions {Object}
 * @returns {UserDto}
 */
UserRepository.prototype.find = function (conditions) {
  const value = this.findByCondition(conditions).one();
  return new UserDto(value);
};

/**
 * @param userDto
 * @returns {boolean}
 */
UserRepository.prototype.create = function (userDto) {
  if (!userDto.chatId) {
    return false;
  }
  this.insert([
    userDto.userId,
    userDto.chatId,
    userDto.username,
    userDto.firstName,
    userDto.lastName,
    userDto.isBot,
    userDto.createdAt
  ]);
  return true;
};

/**
 * @param userDto
 * @returns {boolean}
 */
UserRepository.prototype.edit = function (userDto) {
  if (!userDto.row) {
    return false;
  }
  const data = [
    userDto.userId,
    userDto.chatId,
    userDto.username,
    userDto.firstName,
    userDto.lastName,
    userDto.isBot,
    userDto.createdAt
  ];
  this.update(data);
  return true;
};
