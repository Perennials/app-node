"use strict";

var Domain = require( 'domain' );

function RequestContext ( app, req, res ) {
	this.app = app;
	this.req = req;
	this.res = res;
	this.domain = Domain.create();
	this.domain.add( req );
	this.domain.add( res );
}

RequestContext.define( {

	dispose: function () {
		this.domain.dispose();
	}

} );

module.exports = RequestContext;