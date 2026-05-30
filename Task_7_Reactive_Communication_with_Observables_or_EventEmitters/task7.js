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

function notificationService(message) {
    console.log("Сервіс сповіщень отримав повідомлення:", message);
}

function loggerService(message) {
    console.log("Логер записав подію:", message);
}

function analyticsService(message) {
    console.log("Аналітика обробила подію:", message);
}

const unsubscribeNotifications = messageBus.subscribe("user:login", notificationService);
const unsubscribeLogger = messageBus.subscribe("user:login", loggerService);
const unsubscribeAnalytics = messageBus.subscribe("user:login", analyticsService);


console.log("Перша подія входу користувача:");

messageBus.sendMessage("user:login", {
    userId: 1,
    username: "Степан"
});


console.log("Відписуємо сервіс сповіщень:");

unsubscribeNotifications();


console.log("Друга подія входу користувача:");

messageBus.sendMessage("user:login", {
    userId: 2,
    username: "Акакій"
});

console.log("Окрема подія замовлення:");

messageBus.subscribe("order:created", (order) => {
    console.log("Замовлення створено:", order);
});

messageBus.subscribe("order:created", (order) => {
    console.log("Система доставки отримала замовлення:", order.id);
});

messageBus.sendMessage("order:created", {
    id: 101,
    product: "Ноутбук",
    price: 25000
});
