"use strict";

var Domain = require( 'domain' );

function HttpAppRequest ( app, req, res ) {
	this.App = app;
	this.Request = req;
	this.Response = res;
	this.Domain = Domain.create();
	this.Domain.add( req );
	this.Domain.add( res );

	this.Response.once( 'close', this.dispose.bind( this ) );
	this.Domain.on( 'error', this.onError.bind( this ) );
	
	this.Domain.run( this.onHttpHeaders.bind( this ) );
}

HttpAppRequest.define( {

	dispose: function () {
		if ( this.Domain ) {
			this.App.unregisterRequest( this );
			this.Domain.remove( this.Request );
			this.Domain.remove( this.Response );
			this.Domain = null;
		}
	},

	onHttpContent: function () {
		throw new Error( 'HttpAppRequest.onHttpContent() not implemented.' );
	},

	onHttpHeaders: function () {
		var _this = this;
		var chunks = [];
		this.Request.on( 'data', function( chunk ) {
			chunks.push( chunk );
		} );

		this.Request.on( 'end', function () {
			var content = Buffer.concat( chunks );
			chunks = null;
			_this.onHttpContent( content );
		} );
	},

	onError: function ( err ) {
		console.error( err.message, err.stack );
		this.App.close( 1 );
	},

} );

module.exports = HttpAppRequest;