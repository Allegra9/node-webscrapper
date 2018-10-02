# hackernews CLI

## How to install
cd into the project's directory and run:
```
npm run install-hackernews
```
Note: If you don't already have NPM installed, you can get it here: https://nodejs.org/en/download/

## How to run
Once you've installed the app, simply type:
```
hackernews --posts [number of posts]
```
or `hackernews -p [number of posts]`
to log the desired number of posts in the console. Default is 30 if you run just `hackernews`.
This CLI app is global, i.e., you can run `hackernews` cmd in Desktop or any other directory.

## Libraries used:
- `cheerio` for HTML elements selection,
- `node-fetch` for fetch API,
- `commander` for running the program from a cmd line, and allowing custom command flags such as: `hackernews -p 5`, and `hackernews --help`.

## Blog post on Medium
Web scrape Hacker News with Node.js
https://medium.com/@allegra9/web-scrape-hacker-news-with-node-js-e2973c1c9d16
