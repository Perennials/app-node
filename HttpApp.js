"use strict";

var App = require( './App' );
var HttpAppRequest = require( './HttpAppRequest' );
var Http = require( 'http' );

function HttpApp ( appRequestClass, host, port ) {
	var _this = this;
	App.call( this );
	this._appRequestClass = appRequestClass;
	this._host = host;
	this._port = port;
	this._server = Http.createServer();
	this._server.on( 'request', function ( req, res ) {
		return _this.onHttpRequest( req, res );
	} );
	this._requests = [];
}

HttpApp.extend( App, {

	// keeps track of the running requests in this http server
	registerRequest: function ( request ) {
		if ( !(request instanceof HttpAppRequest) ) {
			throw new TypeError( 'Not an HttpAppRequest.' );
		}
		this._requests.push( request );
	},

	unregisterRequest: function ( request ) {
		for ( var i = this._requests.length - 1; i >= 0; --i ) {
			if ( this._requests[ i ] === request ) {
				this._requests.splice( i, 1 );
				return true;
			}
		}
		return false;
	},

	startListening: function () {
		this._server.listen( this._port, this._host );
	},

	close: function ( callback ) {

		var _this = this;
		this._server.close( function () {
			_this.onClose( callback );
		} );
	},

	onHttpRequest: function ( req, res ) {
		this.registerRequest( new this._appRequestClass( this, req, res ) );
	}

} );

module.exports = HttpApp;
