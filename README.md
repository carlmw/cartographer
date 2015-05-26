# Cartographer

A simple web crawler for static assets

Tested on Node v0.12.4 and io.js 2.10 (I haven't tested on older versions but it might be alright 😓)

# Installation
    mkdir cartographer
    cd cartographer
    git clone git@github.com:carlmw/cartographer.git .
    npm install

# Running the tests

    npm test

# API

## Cartographer.discover(pageUrl);

Given a URL `discover` will fetch the page and search for stylesheets and scripts within the returned HTML.

### Example

```javascript
Cartographer.discover(pageUrl).on('data', function (asset) {
  # => asset = [type, assetPath, pageUrl];
});
```

# Using the CLI

`./bin/cmd.js http://example.com/foo.html`

When the module is installed globally, Cartographer should be added to your path:

`cartographer http://example.com/foo.html`

# TODO

- Better error handling
- Better asset matching
  - Would be great to find a library that does this far better than my RegExps
- Extract the recursion and remove state

# My approach

I started by spending a little time (probably a little too much time) looking for libraries that would make my life a lot easier.

I tried:

* [htmlparser2](https://github.com/fb55/htmlparser2)
* [trumpet](https://github.com/substack/node-trumpet)

Given some more time i'd probably do some benchmarking but I decided to go with trumpet because substack is pretty legendary and the htmlparser2 API seemed pretty clunky.

It soon became apparent that trumpet didn't do exactly what I wanted it to. It is engineered for transforming HTML, whereas I wanted to just select certain tags and pipe some attributes through.

Spelunking through trumpet's `package.json` I found [html-tokenize](https://github.com/substack/html-tokenize) (also by substack ✊), given a stream it will pipe out a stream of tokenized HTML. I decided to use this and filter down to the interesting tags myself.

For making HTTP requests I went with [request](https://github.com/request/request) because I just didn't want to be messing with different schemes and request gives me a simple stream I can plug straight into html-tokenize.

My approach involves hitting the first page to find anchors, scripts and stylesheets. When an anchor resolves to a page on the same host I then recurse into it collecting its assets and those of its children.

When an asset is found its [type, path, source page] are output on a firehose.

My intention would be to pipe this into any number of formatters. This would be great for creating an asset dependency tree or site hierarchy.




