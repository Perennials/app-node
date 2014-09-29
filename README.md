App
===
Application classes for Node.js.

```sh
npm install https://github.com/Perennials/app-node/tarball/master
```

<!-- MarkdownTOC -->

- [HttpApp](#httpapp)
	- [Example usage](#example-usage)
	- [Methods](#methods)
- [RequestContext](#requestcontext)
- [App](#app)
	- [Methods](#methods-1)
- [Config](#config)
	- [Example usage](#example-usage-1)
- [Argv](#argv)
	- [Example usage](#example-usage-2)
- [CliColors](#clicolors)
	- [Example usage](#example-usage-3)
- [Authors](#authors)

<!-- /MarkdownTOC -->

HttpApp
-------

Extends [App](#app).

Provides a base for building HTTP server applications. The default
implementation takes care of reading the whole request and handling errors
with node domains, so errors are associated with the proper HTTP request.

### Example usage

```js
var HttpApp = require( 'App/HttpApp' );

function MyHttpApp () {
	HttpApp.call( this, '0.0.0.0', 80 );
}

MyHttpApp.extend( HttpApp, {

	onError: function ( ctx ) {

		console.log( 'Damn, error happened with the client request', ctx.req );

		// finish the response so we can close the server
		ctx.res.writeHead( 500 );
		ctx.res.end();
	},


	// this will be called when we have the whole http request
	onHttpContent: function ( ctx ) {

		if ( ctx.req.headers[ 'content-encoding' ] === 'identity' ) {
			console.log( 'The request content is', ctx.req.content.toString( 'utf8' ) );
		}

		doSomethingWithThe( ctx.req, function ( good ) {

			ctx.res.writeHead( good ? 200 : 500, {
				'Connection': 'close',
				'Content-Type': 'text/plain'
			} );
			ctx.res.end( 'bye' );

		} );

	}

} );

var app = new MyHttpApp();
app.startListening();

```

### Methods

```js
new HttpApp( host:String, port:Number );
```
Constructor.

```js
.startListening();
```
Starts listening for HTTP requests.


```js
.cleanup();
```
Closes the HTTP server (http.Server.close).


```js
.onHttpContent( ctx:RequestContext );
```
Called whenever there is HTTP request and the whole request content is received.
**Must be overriden**.


```js
.onError( ctx:RequestContnext );
```
Called whenever uncaught exception happens in the context of an HTTP request.
**Recommended to override**.


```js
.onHttpHeaders( ctx:RequestContext );
```
Called whenever there is HTTP request. The default implementation installs
'data' handler, reads the content and calls `.onHttpContent()`. Can be overriden
in case access to the HTTP headers is needed before handling the content.


```js
.onHttpRequest( req, res );
```
Default HTTP request handler called directly from node's http.Server. The
default implementation does the domain handling. Can be overriden for advanced
use.



RequestContext
--------------

This object encapsulates node's native types passed to the HTTP request
callback, as well as the domain associated with the request.

```js
{
	req: http.IncommingMessage,
	res: http.ServerResponse,
	domain: Domain
}
```


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


Config
------

The Config class provides stack-able object of properties, where the
properties in the objects of the upper layers can override the lower layers.

Properties can refer to other properties and have dynamic value.

### Example usage

#### Stacking

```js
var Config = require( 'App/Config' );

// default language
var ENG = new Config( { hello: 'hello', bye: 'bye' } );

// another language extends the default
var DEU = new Config( { hello: 'hallo', bye: 'auf wiedersehen' }, ENG );

// and yet another one
var langs = new Config( { hello: 'holla' }, DEU );

// static propertiers can be accessed directly
if ( langs.hello == 'holla' ) {
	// we have spanish string for hello
}
if ( langs.bye == 'auf wiedersehen' ) {
	// we don't have spanish string for bye and we use the german fallback
}
```

#### References

```js
var Config = require( 'App/Config' );

var cfg = new Config( {
	shared: {
		separator: ', '
	},

	// we have absolute reference {name.full} and dynamic value {1}
	my_name: 'my name is {name.full}; i am {1} years old.',
	
	name: {
		first: 'tosho',
		last: 'afrikanski',
		
		// this is relative reference from the current node (_) or from the parent node (__)
		full: '{_.last}{__.shared.separator}{_.first}'
	}
} );

if ( cfg.get( 'my_name', 30 ) == 'my name is afrikanski, tosho; i am 30 years old.' ) {
	// ...
}
```


Argv
----

Helps with parsing application command line.

### Example usage

```js
var Argv = require( 'App/Argv' );

var argv = Argv.parse( [ '-arg1=value', '-flag', 'arg2', '-arg3=1', '-arg3=2', '-arg3' ] );
// this will become
{ arg1: 'value', flag: true, "2": 'arg2', arg3: [ '1', '2', true ] };
```


CliColors
---------

Provides the list of basic terminal color palette.

The colors are: `black`, `red`, `green`, `yellow`, `blue`, `magenta`, `cyan`, `white`.

Each color has `bright` (or `intense`) and `bg` (background) variants. E.g.
`brightblue`, `redbg`, `intenseredbg`.

Additionally:

* `gray` is synonim for `intenseblack`.
* `def` - default foreground.
* `defbg`, `resetbg` - default background.
* `reset` - reset all styles.


### Example usage

```js
var clr = require( 'App/CliColors' );

console.log( clr.blue, clr.greenbg, 'blue on green background',
             clr.def, 'default on green background',
             clr.reset, 'default' );
```

Authors
-------
Borislav Peev (borislav.asdf at gmail dot com)