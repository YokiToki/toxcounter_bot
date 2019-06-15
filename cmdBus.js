/**
 * @constructor
 */
function CmdBus() {
  this.commands = [];
}

/**
 * @param regexp
 * @param callback
 */
CmdBus.prototype.on = function (regexp, callback) {
  this.commands.push({regexp: regexp, callback: callback});
};

/**
 * @param client
 * @returns {boolean}
 */
CmdBus.prototype.condition = function (client) {
  const message = client.payload.message.text || '';
  return message.charAt(0) === '/';
};

/**
 * @param client
 * @returns {*}
 */
CmdBus.prototype.handle = function (client) {
  const message = client.payload.message.text || '';
  for (var i in this.commands) {
    var cmd = this.commands[i];
    var tokens = cmd.regexp.exec(message);
    if (tokens != null) {
      try {
        return cmd.callback.apply(client, tokens.splice(1));
      } catch (e) {
        console.error('Error: ' + e);
      }
    }
  }
  return client.sendMessage(messages.help);
};