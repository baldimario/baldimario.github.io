---
{
  "title": "[Sticky Post] Github powered blog, git under the hood!",
  "description": "This is a sticky post! It will always be the first post on the blog to ensure visibility of what's empower this blog!",
  "image": "https://raw.githubusercontent.com/baldimario/github-cms/refs/heads/main/logo.png",
  "datetime": "1970/00/00 00:00",
  "author": "Mario Baldi"
}
---

# Welcome to My GitHub-Powered Blog! 

This blog is a little unconventional: **the engine under the hood is Git!**  

Using the **GitHub API**, the blog is powered directly by a GitHub repository. The content is extracted from specific files, and Markdown is rendered beautifully following some metadata and conventions I've set up.  

## How It Works
- **Content Source**: The posts live as Markdown files in a GitHub repository.  
- **Metadata**: Each post begins with a small JSON snippet that includes extra details like title, tags, and date.  
- **Rendering**: The blog fetches these files dynamically, processes them, and displays them here.  
- **Caching**: For performance, a caching layer leverages your browser's `localStorage` to minimize API calls and make the blog snappier.

## Why GitHub as a CMS?
This is an **experimental side project** called [GitHub CMS](https://github.com/baldimario/github-cms). My goal is to explore the possibilities of using GitHub as a simple and powerful backend for personal blogs and other lightweight CMS use cases.  

It's:
- **Collaborative**: Anyone can contribute via pull requests!
- **Minimalist**: No need for fancy server-side setups. Just push a Markdown file and let the system do the rest.
- **Transparent**: The source code is open and available [here](https://github.com/baldimario/github-cms). Feel free to explore, fork, or use it for your own projects!

## 100% Client-Side Magic

One of the coolest aspects of this blog is that everything happens on the client side—there's no server rendering or backend magic involved! When you visit this blog, your browser interacts directly with the GitHub API to fetch the content, render the Markdown, and apply styles. Thanks to the browser's localStorage, it even caches the data for faster navigation. This makes the blog lightweight, fast, and completely transparent—what you see is what your browser builds in real-time!

## Configuration Overview

The GithubFileSystem class allows you to interact with a GitHub repository's contents using the GitHub API. The configuration object is the heart of this setup. Here's a quick breakdown of the important parameters:

    username: Your GitHub username, which tells the system whose repository to fetch data from.
    repository: The name of the GitHub repository that contains your blog files.
    branch: The branch from which to fetch the files (e.g., main, master, or any custom branch).
    root: A subdirectory inside the repository that contains the blog files. This is essential for structuring your repository neatly and keeping unrelated files separate.

## Configure the GithubFileSystem class that powers the blog

Here's how you can easily set up the blog:

```javascript
// Configuration object
const config = {
    github: {
        username: 'baldimario', // Your GitHub username
        repository: 'baldimario.github.io', // The repository containing the blog files
        branch: 'master', // The branch where the blog content lives
        root: 'cms' // The subdirectory inside the repo for blog files
    }
};
```

then you can create an instance of the GithubFileSystem class and use `ls` and `cat` methods to interact with the repository.

## Cache Configuration

The GithubFileSystem supports an optional caching mechanism to reduce API calls and improve performance. You can pass a custom Cache component or let it create one automatically. Here’s how you can configure the cache:

let lifetime = 3600; // Cache lifetime in seconds
const ghfsWithCache = new GithubFileSystem(config, new Cache('prefix', lifetime));

This ensures your blog operates efficiently while keeping data fresh for your users.

## Key Parameters to Customize

    root: If you structure your repository with a dedicated folder for blog files (e.g., cms), you can specify it here. This keeps the repo clean and focused.
    repository: Choose any repository from your account, allowing flexibility in hosting your blog on personal or organization repos.
    branch: Set it to match the branch you use for content updates, ensuring you're always fetching the correct files.

With this setup, you’re ready to roll! Just push Markdown files to the cms folder, and the blog will dynamically fetch and render them.

## How to Post
1. Create a Markdown file for your post.  
2. Add a small JSON block at the top with details like:
   ```json
   {
     "title": "Your Post Title",
     "date": "2024-12-01",
     "tags": ["example", "github-cms", "markdown"]
   }
    ```
3. Push your Markdown file to the designated GitHub repository.

That’s it! Your post will automatically appear here.

## Want to Contribute?

Check out the [GitHub CMS repository](https://github.com/baldimario/github-cms) to learn more about how it works and how you can get involved. Whether you want to use it for your own projects or help improve it, all contributions are welcome!

Thanks for visiting and happy blogging!
