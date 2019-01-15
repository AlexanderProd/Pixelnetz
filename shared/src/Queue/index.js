class Queue {
  constructor(iter = []) {
    this._head = null;
    this._tail = null;
    this._size = 0;

    for (const item of iter) {
      this.enqueue(item);
    }
  }

  size() {
    return this._size;
  }

  enqueue(item) {
    this._size += 1;

    const nextTail = {
      value: item,
      next: null,
    };

    if (!this._tail) {
      this._tail = nextTail;
      this._head = nextTail;
    } else {
      this._tail.next = nextTail;
      this._tail = nextTail;
    }
  }

  dequeue() {
    if (!this._head) {
      return undefined;
    }
    this._size -= 1;
    const { value, next } = this._head;
    this._head = next;
    if (!next) {
      this._tail = null;
    }
    return value;
  }

  head() {
    return this._head ? this._head.value : undefined;
  }

  tail() {
    return this._tail ? this._tail.value : undefined;
  }

  [Symbol.iterator]() {
    let current = this._head;
    return {
      next() {
        if (!current) {
          return {
            done: true,
          };
        }
        const iterValue = {
          value: current.value,
          done: false,
        };
        current = current.next;
        return iterValue;
      },
    };
  }
}

export default Queue;
