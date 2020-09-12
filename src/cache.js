class Cache {
  constructor() {
    this.cache = new Map();
  }
  get(key, defaultValue) {
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    return defaultValue;
  }

  set(key, value) {
    if(this.cache.size > 100 ) {
      this.cache = new Map();
    }
    this.cache.set(key, value);
  }
}

module.exports = new Cache();
