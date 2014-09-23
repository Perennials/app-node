"use strict";

require( 'Prototype' );
var Argv = require( './Argv.js' );

function App () {
	this.argv = Argv.parse();
	
	var _this = this;
	var shutdown = function () {
		return _this.shutdown.apply( _this, arguments );
	};

	process.on( 'SIGINT', shutdown );
	process.on( 'SIGHUP', shutdown );
	process.on( 'SIGTERM', shutdown );
}

App.define( {

	getArgv: function () {
		return this._argv;
	},

	cleanup: function ( ready ) {
		ready();
	},

	shutdown: function ( code ) {

		this.cleanup( function () {
			process.exit( code );
		} );

	}

} );

module.exports = App;