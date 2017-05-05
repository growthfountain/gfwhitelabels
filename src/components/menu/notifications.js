const io = require('socket.io-client');
const channels = ['general'];

let __instance = null;

class Notifications {

  constructor() {
    Object.assign(this, Backbone.Events);
    this.__socket = io(app.config.notificationsServer);
    this.__socket.on('connect', () => {
      this.__socket.emit('subscribe', {
        jwt: app.user.token,
        channels: channels,
        "numMessagesFromArchive": 0,
      });
    });

    this.__attachEvents();
  }

  __attachEvents() {
    channels.forEach((channel) => {
      this.__socket.on(channel, (data) => {
        if (data === null || typeof data[Symbol.iterator] !== 'function')
          data = [data];
        this.trigger(channel, data);
      });
    });
  }

  markAsRead(messageId) {
    this.__socket.emit('markRead', messageId);
  }

}


module.exports = () => {
  if (!__instance)
    __instance = new Notifications();

  return __instance;
};
