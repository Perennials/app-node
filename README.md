App
===
Application classes for Node.js.

```sh
npm install https://github.com/Perennials/app-node/tarball/master
```

```js
var HttpApp = require( 'App/HttpApp' );
var Config = require( 'App/Config' );
var Argv = require( 'App/Argv' );
var clr = require( 'App/CliColors' );
```

<!-- MarkdownTOC -->

- [App](#app)
	- [Methods](#methods)
- [Authors](#authors)

<!-- /MarkdownTOC -->


App
---

Base application class for `HttpApp`. Not to be used directly.

This class will install `.shutdown()` as signal handler for `SIGINT`, `SIGHUP`,
`SIGTERM`, so it will try to close gracefully in all cases.

### Methods

```js
.getArgv() : Object|null;
```
Retrieves the `process.argv` parsed with `Argv.parse()`.

```js
.cleanup( callback:function() );
```
Performs application specific cleanup (as preparation graceful shutdown). The
default function does nothing but call the callback.

```js
.shutdown( code:Number );
```
Performs `.cleanup()` and then calls `process.exit( code )`.


Authors
-------
Borislav Peev (borislav.asdf at gmail dot com)