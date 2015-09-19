"use strict";

var HttpApp = require( '../HttpApp' );
var HttpAppRequest = require( '../HttpAppRequest' );

// this will be instantiated by HttpApp whenever we have a new request coming in
class MyAppRequest extends HttpAppRequest {
	
	onError ( err ) {

		console.log( 'Damn, error happened with this specific client request', Object.toString( this._request ) );

		// finish the response so we can close the server
		this._response.writeHead( 500 );
		this._response.end();

		// call the default handler, which will abort the app
		super.onError( err );
	}


	// this will be called when we have the whole http request
	onHttpContent ( content ) {

		// we have the full request at this point, headers and content
		if ( this._request.headers[ 'content-encoding' ] === 'identity' ) {
			console.log( 'The request content is', content.toString( 'utf8' ) );
		}

		doSomethingWithThe( this._request, function ( good ) {

			// normal nodejs handling of the response
			this._response.writeHead( good ? 200 : 500, {
				'Connection': 'close',
				'Content-Type': 'text/plain'
			} );
			this._response.end( 'bye' );

		} );

	}
}

// construct a new HttpApp, tell it our request class is MyAppRequest
var app = new HttpApp( MyAppRequest, '0.0.0.0', 1337 );
app.startListening();


setTimeout( function () {
	require( 'child_process' ).exec( 'curl localhost:1337' );
}, 300 );
