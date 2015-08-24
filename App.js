"use strict";

require( 'Prototype' );
var Argv = require( './Argv.js' );

function App () {
	this.argv = Argv.parse();
	
	var _this = this;
	var close = function () {
		return _this.close.apply( _this, arguments );
	};

	process.on( 'SIGINT', close );
	process.on( 'SIGHUP', close );
	process.on( 'SIGTERM', close );
}

App.define( {

	getArgv: function () {
		return this._argv;
	},

	onClose: function ( callback ) {
		if ( callback instanceof Function ) {
			callback();
		}
	},

	close: function ( code ) {

		this.onClose( function () {
			process.exit( code );
		} );

	}

} );

module.exports = App;