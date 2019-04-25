export type EventHandler = (...args: any[]) => void;

class Emitter {
  private _events: { [event: string]: EventHandler[] };

  private _strict: boolean;

  constructor(events?: string[], { strict = true } = {}) {
    this._events = {};
    this._strict = strict;

    if (events && events.length) {
      for (const event of events) {
        this.register(event);
      }
    }
  }

  register(event: string) {
    if (event in this._events) {
      throw new Error(`Event '${event}' is already registered`);
    }
    this._events[event] = [];
  }

  on(event: string, handler: EventHandler) {
    if (!(event in this._events)) {
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

  emit(event: string, ...args: any[]) {
    if (event in this._events) {
      this._events[event].forEach(handler => {
        handler(...args);
      });
    } else {
      throw new Error(`Unregistered event '${event}' emitted`);
    }
  }
}

export default Emitter;
