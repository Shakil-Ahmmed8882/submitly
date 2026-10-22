type TListener = () => void;

const listeners = new Set<TListener>();

export const sessionEvents = {
  expired() {
    for (const listener of listeners) listener();
  },
  subscribe(listener: TListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
