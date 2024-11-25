/*
cache that uses localstorage and save in a prefixed entry the state of the application
it checks in an entry the time of the last cache update, if 24 hours is passed from that time
empty the cache
*/
var Cache = (function () {
    function Cache(prefix) {
        this.prefix = prefix
    }

    /* return the value associated with the key from localstorage */
    function get(key) {
        var storedValue = localStorage.getItem(`${this.prefix}_${key}`);
        if (storedValue) {
            var storedTime = localStorage.getItem(`${this.prefix}_${key}_time`);
            if (storedTime && (Date.now() - storedTime) / 1000 / 60 / 60 / 24 >= 1) {
                localStorage.removeItem(`${this.prefix}_${key}`);
                localStorage.removeItem(`${this.prefix}_${key}_time`);
                return null;
            }
            return storedValue;
        }
        return null;
    }

    /* set the key to value and save the time of the last cache update */
    function set(key, value) {
        localStorage.setItem(`${this.prefix}_${key}`, value);
        localStorage.setItem(`${this.prefix}_${key}_time`, Date.now());
        return value;
    }

    /* delete the key and the associated time */
    function del(key) {
        localStorage.removeItem(`${this.prefix}_${key}`);
        localStorage.removeItem(`${this.prefix}_${key}_time`);
        return true;
    }

    GithubFileSystem.prototype.get = async function (key) {
        return await get.call(this, key);
    }

    GithubFileSystem.prototype.set = async function (key, value) {
        return await set.call(this, key, value);
    }

    GithubFileSystem.prototype.del = async function (key) {
        return await del.call(this, key);
    }

    return Cache;
}());
