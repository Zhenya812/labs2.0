class BiDirectionalPriorityQueue {
    constructor() {
        this.items = [];
        this.orderCounter = 0;
    }

    enqueue(item, priority) {
        this.items.push({
            item: item,
            priority: priority,
            order: this.orderCounter
        });

        this.orderCounter++;
    }

    peek(type = "highest") {
        if (this.items.length === 0) {
            return null;
        }

        const index = this.findIndex(type);
        return this.items[index].item;
    }

    dequeue(type = "highest") {
        if (this.items.length === 0) {
            return null;
        }

        const index = this.findIndex(type);
        const removedItem = this.items.splice(index, 1)[0];

        return removedItem.item;
    }

    findIndex(type) {
        let selectedIndex = 0;

        for (let i = 1; i < this.items.length; i++) {
            const current = this.items[i];
            const selected = this.items[selectedIndex];

            if (type === "highest" && current.priority > selected.priority) {
                selectedIndex = i;
            }

            if (type === "lowest" && current.priority < selected.priority) {
                selectedIndex = i;
            }

            if (type === "oldest" && current.order < selected.order) {
                selectedIndex = i;
            }

            if (type === "newest" && current.order > selected.order) {
                selectedIndex = i;
            }
        }

        return selectedIndex;
    }

    size() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

const queue = new BiDirectionalPriorityQueue();

queue.enqueue("Оновлення профілю", 3);
queue.enqueue("Критична помилка", 7);
queue.enqueue("Рекламне повідомлення", 2);
queue.enqueue("Запит користувача", 5);

console.log("Найвищий пріоритет:", queue.peek("highest"));
console.log("Найнижчий пріоритет:", queue.peek("lowest"));
console.log("Найстаріший елемент:", queue.peek("oldest"));
console.log("Найновіший елемент:", queue.peek("newest"));

console.log("Видалено елемент з найвищим пріоритетом:", queue.dequeue("highest"));
console.log("Видалено елемент з найнижчим пріоритетом:", queue.dequeue("lowest"));
console.log("Видалено найстаріший елемент:", queue.dequeue("oldest"));
console.log("Видалено найновіший елемент:", queue.dequeue("newest"));

console.log("Розмір черги:", queue.size());
console.log("Чи черга порожня:", queue.isEmpty());
