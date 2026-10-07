const syncStore = (function() {
  const PREFIX = 'sep:';
  let store = null;
  let subscriptions = {};

  function detectStorage() {
    try {
      const test = '__sync-store-test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return localStorage;
    } catch (e) {
      try {
        return sessionStorage;
      } catch (e2) {
        return null;
      }
    }
  }

  store = detectStorage();

  function prefixedKey(key) {
    return PREFIX + key;
  }

  function get(key) {
    if (!store) return null;
    const value = store.getItem(prefixedKey(key));
    if (value === null) return null;
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  }

  function set(key, value) {
    if (!store) return;
    const serialized = JSON.stringify(value);
    const pKey = prefixedKey(key);
    store.setItem(pKey, serialized);

    const eventData = { key: key, value: value };

    if (subscriptions[key]) {
      subscriptions[key].forEach(cb => cb(value));
    }

    if (typeof StorageEvent !== 'undefined') {
      const event = new StorageEvent('storage', {
        key: pKey,
        newValue: serialized,
        url: window.location.href,
        storageArea: store
      });
      window.dispatchEvent(event);
    }
  }

  function subscribe(key, callback) {
    if (!subscriptions[key]) {
      subscriptions[key] = [];
    }
    subscriptions[key].push(callback);
  }

  window.addEventListener('storage', function(e) {
    if (!e.key || !e.key.startsWith(PREFIX)) return;
    const key = e.key.substring(PREFIX.length);
    if (subscriptions[key]) {
      let value = e.newValue;
      if (value) {
        try {
          value = JSON.parse(value);
        } catch (err) {}
        subscriptions[key].forEach(cb => cb(value));
      }
    }
  });

  function clear() {
    if (!store) return;
    const keys = Object.keys(store);
    keys.forEach(key => {
      if (key.startsWith(PREFIX)) {
        store.removeItem(key);
      }
    });
  }

  function remove(key) {
    if (!store) return;
    store.removeItem(prefixedKey(key));
  }

  return { get, set, subscribe, clear, remove };
})();