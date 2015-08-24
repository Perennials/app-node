var HttpApp = require( '../HttpApp.js' );
var HttpRequest = require( 'Net/HttpRequest' );

UnitestA( 'HttpApp.onHttpContent', function ( test ) {

	var app1 = new HttpApp( '127.0.0.1', 55555 );
	app1.onHttpContent = function ( ctx ) {
		test( ctx.req.headers.someting === 'custom' );
		test( ctx.req.content.toString() === 'asd.qwe' );
		ctx.res.end();
		this.onClose( function () {
			test.out();
		} );
	};
	app1.startListening();
	(new HttpRequest( 'http://127.0.0.1:55555' ))
		.setHeader( 'someting', 'custom' )
		.send( 'asd.qwe' );

} );

UnitestA( 'Parallel domain handling', function ( test ) {

	var nreq = 0;
	var nerr = 0;

	var app1 = new HttpApp( '127.0.0.1', 55555 );
	app1.onHttpContent = function ( ctx ) {
		++nreq;
		if ( nreq === 1 ) {
			setTimeout( function () {
				throw new Error( '1' );
			}, 100 );
		}
		else if ( nreq === 2 ) {
			setTimeout( function () {
				process.nextTick( function () {
					throw new Error( '2' );
				} );
			}, 50 );	
		}
		else if ( nreq === 3 ) {
			throw new Error( '3' );
		}
	};
	app1.onError = function ( err, ctx ) {
		++nerr;
		ctx.res.end();
		if ( nerr === 1 ) {
			test( err.message === '3' );
			test( ctx.req.content.toString() === '333' );
			this.onClose( function () {
				test.out();
			} );
		}
		else if ( nerr === 2 ) {
			test( err.message === '2' );
			test( ctx.req.content.toString() === '222' );
		}
		else if ( nerr === 3 ) {
			test( err.message === '1' );
			test( ctx.req.content.toString() === '111' );
		}
	};
	app1.startListening();
	(new HttpRequest( 'http://127.0.0.1:55555' )).send( '111' );
	(new HttpRequest( 'http://127.0.0.1:55555' )).send( '222' );
	(new HttpRequest( 'http://127.0.0.1:55555' )).send( '333' );
} );
