var env = {
    github: {
        api: 'https://api.github.com',
        raw: 'https://raw.githubusercontent.com'
    }
}

var GithubFileSystem = (function () {
    function GithubFileSystem(config) {
      this._config = config;
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
        return await fetch(getApiUrl(directory))
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(data => regexp ? data.filter(item => item['name'].match(regexp)) : data)
        .catch(error => console.error('Error:', error));
    }

    async function cat(path) {
        return await fetch(getRawUrl(path))
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(data => data['encoding'] == 'base64' ? decodeBase64(data['content']) : null)
        .catch(error => console.error('Error:', error));
    }

    GithubFileSystem.prototype.ls = async function (directory, regexp = null) {
      return await ls.call(this, directory, regexp);
    }

    GithubFileSystem.prototype.cat = async function (path) {
      return await cat.call(this, path);
    }

    return GithubFileSystem;
}());
