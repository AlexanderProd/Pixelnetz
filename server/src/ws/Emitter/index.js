class Emitter {
  constructor(events, { strict = true } = {}) {
    this._events = {};
    this._strict = strict;

    if (events && events.length) {
      for (const event of events) {
        this.register(event);
      }
    }
  }

  register(event) {
    if (this._events.hasOwnProperty(event)) {
      throw new Error(
        `Event '${event}' is already registered`,
      );
    }
    this._events[event] = [];
  }

  on(event, handler) {
    if (!this._events.hasOwnProperty(event)) {
      if (!this._strict) {
        this._events[event] = [];
      } else {
        throw new Error(
          `Handler for unregistered event '${event}' attached`,
        );
      }
    }
    this._events[event].push(handler);
  }

  emit(event, ...args) {
    if (this._events.hasOwnProperty(event)) {
      this._events[event].forEach(handler => {
        handler(...args);
      });
    } else {
      throw new Error(
        `Unregistered event '${event}' emitted`,
      );
    }
  }
}

export default Emitter;
