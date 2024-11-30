var Cache = (function () {
    function Cache(prefix, lifetime = 86400) {
        this.prefix = prefix
        this.lifetime = lifetime
    }

    /* return the value associated with the key from localstorage */
    function get(key) {
        var storedValue = localStorage.getItem(`${this.prefix}_${key}`);
        if (storedValue) {
            var storedTime = localStorage.getItem(`${this.prefix}_${key}_time`);
            if (storedTime && (Date.now() - storedTime) / 1000 >= this.lifetime) {
                localStorage.removeItem(`${this.prefix}_${key}`);
                localStorage.removeItem(`${this.prefix}_${key}_time`);
                return null;
            }
            return JSON.parse(storedValue);
        }
        return null;
    }

    /* set the key to value and save the time of the last cache update */
    function set(key, value) {
        let jsonValue = JSON.stringify(value)
        localStorage.setItem(`${this.prefix}_${key}`, jsonValue);
        localStorage.setItem(`${this.prefix}_${key}_time`, Date.now());
        return value;
    }

    /* delete the key and the associated time */
    function del(key) {
        localStorage.removeItem(`${this.prefix}_${key}`);
        localStorage.removeItem(`${this.prefix}_${key}_time`);
        return true;
    }

    Cache.prototype.get = function (key) {
        return get.call(this, key);
    }

    Cache.prototype.set = function (key, value) {
        return set.call(this, key, value);
    }

    Cache.prototype.del = function (key) {
        return del.call(this, key);
    }

    return Cache;
}());
