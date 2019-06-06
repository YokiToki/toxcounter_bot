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
  return client.payload.message.text.charAt(0) === '/';
};

/**
 * @param client
 * @returns {*}
 */
CmdBus.prototype.handle = function (client) {
  for (var i in this.commands) {
    var cmd = this.commands[i];
    var tokens = cmd.regexp.exec(client.payload.message.text);
    if (tokens != null) {
      return cmd.callback.apply(client, tokens.splice(1));
    }
  }
  return client.sendMessage("На глаза себе нажми, пидор!");
};