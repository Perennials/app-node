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
		this._server.close( ready );
	},

	onError: function ( err, rqctx ) {
		this.shutdown( 1 );
	},

	onHttpRequest: function ( req, res ) {
		var _this = this;
		var rqctx = new RequestContext( this, req, res );

		res.on( 'close', function () {
			rqctx.dispose();
		} );
	
		rqctx.domain.on( 'error', function ( err ) {
			return _this.onError( err, rqctx );
		} );
		
		rqctx.domain.run( function () {
			_this.onHttpHeaders( rqctx );
		} );
	},

	onHttpContent: function ( rqctx ) {
		throw new Error( 'HttpApp.onHttpContent() not implemented.' );
	},

	onHttpHeaders: function ( rqctx ) {
		var _this = this;
		var chunks = [];
		rqctx.req.on( 'data', function( chunk ) {
			chunks.push( chunk );
		} );

		rqctx.req.on( 'end', function () {
			rqctx.req.content = Buffer.concat( chunks );
			_this.onHttpContent( rqctx );
		} );
	}

} );

module.exports = HttpApp;