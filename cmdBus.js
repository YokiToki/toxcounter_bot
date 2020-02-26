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
  const message = client.payload.message || {};
  const text = message.text || '';
  return text.charAt(0) === '/';
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
        const args = tokens.splice(1);
        return cmd.callback.apply(client, args);
      } catch (e) {
        console.error('Error: ', e, e.stack);
      }
    }
  }
  return client.sendMessage(messages.help);
};