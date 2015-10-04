"use strict";

class IncommingMessageReader {

	constructor ( message ) {
		this._message = message;
		message.on( 'data', this.onData.bind( this ) );
		message.on( 'error', this.onError.bind( this ) );
		message.on( 'end', this.onEnd.bind( this ) );
	}

	onError ( err ) {

	}

	onData ( data ) {

	}

	onEnd () {

	}

}

module.exports = IncommingMessageReader;