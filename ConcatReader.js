"use strict";

var Snappy = null;
try { Snappy = require( 'snappy' ); }
catch ( e ) {}
var Zlib = require( 'zlib' );

var IncommingMessageReader = require( './IncommingMessageReader' );

class ConcatReader extends IncommingMessageReader {

	constructor ( message, callback ) {
		super( message );
		this._chunks = [];
		this._callback = callback;
	}

	onError ( err ) {
		this._callback( err );
	}

	onData ( data ) {
		this._chunks.push( data );
	}

	onEnd () {
		var content = Buffer.concat( this._chunks );
		this._chunks = null;

		var encoding = this._message.headers[ 'content-encondig' ];
		var _this = this;
	
		if ( encoding === 'gzip'  ) {
			Zlib.gunzip( content, function ( err, decompressed ) {
				_this._callback( err, decompressed );
			} );
		}
		else if ( encoding === 'deflate'  ) {
			Zlib.inflate( content, function ( err, decompressed ) {
				_this._callback( err, decompressed );
			} );
		}
		else if ( encoding === 'snappy' && Snappy ) {
			Snappy.decompress( content, function ( err, decompressed ) {
				_this._callback( err, decompressed );
			} );
		}
		else {
			_this._callback( null, content );
		}
	}

}

module.exports = ConcatReader;