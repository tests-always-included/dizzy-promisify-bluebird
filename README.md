Dizzy-Promisify-Bluebird
========================

When you use [Dizzy] to perform dependency injection you could also want the things to use promises.  For instance, using `fs.readFile()` can get you into a mess with callbacks.  By leveraging [Bluebird], you can make all node-style callback functions return promises.  That call to `fs.readFile()` turns into `fs.readFileAsync()` and you've started a promise chain.

[![npm version][npm-badge]][npm-link]
[![Build Status][travis-badge]][travis-link]
[![Dependencies][dependencies-badge]][dependencies-link]
[![Dev Dependencies][devdependencies-badge]][devdependencies-link]
[![codecov.io][codecov-badge]][codecov-link]


Overview
--------

First, you will likely want to get Dizzy up and running.

    var container, Dizzy;

    Dizzy = require('dizzy');

Next, call the plugin and pass in your reference to Dizzy.

    require('dizzy-promisify-bluebird')(Dizzy);

Make your container.

    container = new Dizzy();

Finally, register some modules to be promisified.

    // One module
    container.register("fsAsync", "fs").fromModule().promisified().cached();

    // Multiple modules
    container.registerBulk({
        cryptoAsync: "crypto",
        globAsync: "glob",
        zlibAsync: "zlib"
    }).fromModule().promisified().cached();


Installation
------------

Use `npm` to install this package easily.

    $ npm install --save dizzy-promisify-bluebird

Alternately you may edit your `package.json` and add this to your `dependencies` object:

    {
        ...
        "dependencies": {
            ...
            "dizzy-promisify-bluebird": "*"
            ...
        }
        ...
    }


More Stuff
----------

Could include project goals, examples, reasoning, API overview, methods, etc.


License
-------

This software is licensed under a [MIT license][LICENSE] that contains an additional non-advertising clause.  [Read full license terms][LICENSE]


[Bluebird]: http://bluebirdjs.com/
[codecov-badge]: https://codecov.io/github/tests-always-included/dizzy-promisify-bluebird/coverage.svg?branch=master
[codecov-link]: https://codecov.io/github/tests-always-included/dizzy-promisify-bluebird?branch=master
[dependencies-badge]: https://img.shields.io/david/tests-always-included/dizzy-promisify-bluebird.svg
[dependencies-link]: https://david-dm.org/tests-always-included/dizzy-promisify-bluebird
[devdependencies-badge]: https://img.shields.io/david/dev/tests-always-included/dizzy.svg
[devdependencies-link]: https://david-dm.org/tests-always-included/dizzy-promisify-bluebird#info=devDependencies
[Dizzy]: https://github.com/tests-always-included/dizzy
[LICENSE]: LICENSE.md
[npm-badge]: https://badge.fury.io/js/dizzy-promisify-bluebird.svg
[npm-link]: https://npmjs.org/package/dizzy-promisify-bluebird
[travis-badge]: https://secure.travis-ci.org/tests-always-included/dizzy-promisify-bluebird.svg
[travis-link]: http://travis-ci.org/tests-always-included/dizzy-promisify-bluebird
