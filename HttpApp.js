"use strict";

var App = require( './App.js' );
var RequestContext = require( './RequestContext.js' );
var Http = require( 'http' );

function HttpApp ( host, port ) {
	var _this = this;
	App.call( this );
	this._host = host;
	this._port = port;
	this._server = Http.createServer();
	this._server.on( 'request', function ( req, res ) {
		return _this.onHttpRequest( req, res );
	} );
}

HttpApp.extend( App, {

	startListening: function () {
		this._server.listen( this._port, this._host );
	},

	cleanup: function ( ready ) {
		try {
			this._server.close( ready );
		}
		catch ( e ) {
			ready();
		}
	},

	onError: function ( err, req, res ) {
		this.shutdown( 1 );
	},

	onHttpRequest: function ( req, res ) {
		var _this = this;
		var ctx = new RequestContext( req, res );

		res.on( 'close', function () {
			ctx.dispose();
		} );
	
		ctx.domain.on( 'error', function ( err ) {
			return _this.onError( err, ctx );
		} );
		
		ctx.domain.run( function () {
			_this.onHttpHeaders( ctx );
		} );
	},

	onHttpContent: function ( ctx ) {
		throw new Error( 'HttpApp.onHttpContent() not implemented.' );
	},

	onHttpHeaders: function ( ctx ) {
		var _this = this;
		var chunks = [];
		ctx.req.on( 'data', function( chunk ) {
			chunks.push( chunk );
		} );

		ctx.req.on( 'end', function () {
			ctx.req.content = Buffer.concat( chunks );
			_this.onHttpContent( ctx );
		} );
	}

} );

module.exports = HttpApp;