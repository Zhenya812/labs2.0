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
