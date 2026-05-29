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