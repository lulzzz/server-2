var mysql = require('mysql');
// Pool for db connections
var pool  = mysql.createPool(require('../config.json').db_conn);

var getConnectionSequence=function(callback){
	if(pool){
		pool.getConnection(function(err, connection){
			// not connected!
			if (err) {
				console.log("ERROR CON");
				throw err;
			};
		 	// Use the connection
		 	/* Begin transaction */
		 	console.log("I was here1111111!!!!" );
			connection.beginTransaction(function(err) {
				//Transaction Error (Rollback and release connection)
				console.log("I was here222222222222!!!!");
				console.log("I HAVE A connection!");
			});
				// if (err) {
			// 		connection.rollback(function() {
		 //                connection.release();
		 //                callback(err)
		 //        	});
			// 	};
			// });

			// return (false,this.connection);
		});
		console.log("I was here3333333333333!!!!");
		// console.log("TAKE THIS CON!!! "+ connection);
		callback(false,this.connection);
	}else{
		callback(true);
	};
};


module.exports = {
	getConnectionSequence
};
