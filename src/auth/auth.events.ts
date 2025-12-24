type Listener = () => void;

const logoutListeners: Listener[] = [];

export function onLogout(fn: Listener) {
  logoutListeners.push(fn);
}

export function emitLogout() {
  logoutListeners.forEach(fn => fn());
}