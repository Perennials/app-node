"use strict";

var App = require( './App.js' );
var Domain = require( 'domain' );
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

	onError: function ( err ) {
		this.shutdown( 1 );
	},

	onHttpRequest: function ( req, res ) {
		console.log(req,res)
		var _this = this;
		var domain = Domain.create();
		domain.add( req );
		domain._req = req;
		domain.add( res );
		domain._res = res;

		res.on( 'close', function () {
			domain.dispose();
			domain._req = null;
			domain._res = null;
		} );
	
		domain.on( 'error', function () {
			return _this.onError.apply( _this, arguments );
		} );
		
		domain.run( function () {
			_this.onHttpHeaders( req, res );
		} );
	},

	onHttpContent: function ( req, res ) {
		throw new Error( 'HttpApp.onHttpContent() not implemented.' );
	},

	onHttpHeaders: function ( req, res ) {
		var _this = this;
		var chunks = [];
		req.on( 'data', function( chunk ) {
			chunks.push( chunk );
		} );

		req.on( 'end', function () {
			req.content = Buffer.concat( chunks );
			_this.onHttpContent( req, res );
		} );
	}

} );

module.exports = HttpApp;