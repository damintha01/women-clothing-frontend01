let listeners = [];
let nextId = 1;

function emit(message, variant) {
  const item = { id: nextId++, message, variant };
  listeners.forEach((listener) => listener(item));
}

export const toast = {
  success: (message) => emit(message, "success"),
  error: (message) => emit(message, "error"),
};

/** Subscribes a listener to new toasts; returns an unsubscribe function. Used by ui/Toast.jsx. */
export function subscribeToasts(listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}
