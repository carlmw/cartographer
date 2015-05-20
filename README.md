# Cartographer

A simple web crawler for static assets

# Installation

    npm install

# Running the tests

    npm test

# API

## Cartographer.discover(pageUrl);

Given a URL `discover` will fetch the given page and search for stylesheets and scripts within the returned HTML.

# TODO

- Recurse into related pages
- Ignore external links
- Filter out errant assets
- Better error handling
- CLI
