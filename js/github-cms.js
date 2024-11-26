var env = {
    github: {
        api: 'https://api.github.com',
        raw: 'https://raw.githubusercontent.com'
    }
}

var GithubFileSystem = (function () {
    function GithubFileSystem(config, cache=null) {
      this._config = config;
      this.cache = cache || new Cache('gitcms', 86400)
    }

    function decodeBase64( string ) {
      return decodeURIComponent(window.atob( string ));
    }

    function getApiUrl(directory) {
        return [
            env.github.api,
            'repos',
            config.github.username,
            config.github.repository,
            'contents',
            config.github.root,
            directory
        ].join('/') + '?ref=' + config.github.branch;
    }

    function getRawUrl(path) {
        return [
            env.github.api,
            'repos',
            config.github.username,
            config.github.repository,
            'contents',
            path
        ].join('/') + '?ref=' + config.github.branch;
    }

    async function ls(directory, regexp = null) {
        let key = directory + ( regexp ? ':' + regexp.toString() : '')
        let response = this.cache.get(key)
        if (response) return response

        response = await fetch(getApiUrl(directory))
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(data => regexp ? data.filter(item => item['name'].match(regexp)) : data)
        .catch(error => console.error('Error:', error));

        this.cache.set(key, response)
        return response
    }

    async function cat(path) {
        let response = this.cache.get(path)
        if (response) return response

        response = await fetch(getRawUrl(path))
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(data => data['encoding'] == 'base64' ? decodeBase64(data['content']) : null)
        .catch(error => console.error('Error:', error));

        this.cache.set(path, response)
        return response
    }

    GithubFileSystem.prototype.ls = async function (directory, regexp = null) {
      return await ls.call(this, directory, regexp);
    }

    GithubFileSystem.prototype.cat = async function (path) {
      return await cat.call(this, path);
    }

    return GithubFileSystem;
}());

