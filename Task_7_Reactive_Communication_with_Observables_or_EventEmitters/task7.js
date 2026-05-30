const EventEmitter = require("events");

class MessageBus extends EventEmitter {
    subscribe(eventName, listener) {
        this.on(eventName, listener);

        return () => {
            this.unsubscribe(eventName, listener);
        };
    }

    unsubscribe(eventName, listener) {
        this.off(eventName, listener);
    }

    sendMessage(eventName, message) {
        this.emit(eventName, message);
    }
}

const messageBus = new MessageBus();