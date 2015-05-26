# Cartographer

A simple web crawler for static assets

# Installation

    npm install

# Running the tests

    npm test

# API

## Cartographer.discover(pageUrl);

Given a URL `discover` will fetch the given page and search for stylesheets and scripts within the returned HTML.

# Using the CLI

`./bin/cmd.js http://example.com/foo.html`

When the module is installed globally, Cartopgraher should be added to your path:

`cartographer http://example.com/foo.html`

# TODO

- Better error handling
- Better asset matching
  - Would be great to find a library that does this far better than my RegExps
