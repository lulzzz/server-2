var mysql = require('mysql');
// Pool for db connections
var pool  = mysql.createPool(require('../config.json').db_conn);

myQuery = function(queryString, values, callback){
	if(pool){
		pool.getConnection(function(err, connection) {
			// not connected!
			if (err) throw err;
		 	// Use the connection
		  	// console.log('3. We have pool and the connection thread id is ' + connection.threadId);
		 	//execute the queryString
		 	console.log("queryString " + queryString)
		 	console.log("values " + values)
		 	connection.query(queryString, values, function(error,results,fields){
		 		if(error){
		 			callback(error);
		 		}else{
		 			// console.log("4. We have query results: " + JSON.stringify(results));
		 			callback(false, results);
		 		}
		 	});
		 	connection.release();
		});
	}else{
		callback(true);
	}
};

module.exports = {
	Qgen_accounts:require("./Qaccount")(myQuery),
	Qgen_roles:require("./Qrole")(myQuery),
	Qgen_functionalities:require("./Qfunctionality")(myQuery),
	Qgen_resources:require("./Qresource")(myQuery),
	Qgen_permissions:require("./Qpermission")(myQuery),
	Qgen_exam_center:require("./Qexam_center")(myQuery),
	Qgen_school:require("./Qschool")(myQuery),
	Qgen_invoice_info:require("./Qinvoice_info")(myQuery),
	Qgen_delegation:require("./QT_delegation")(myQuery),
	Qgen_student:require("./Qstudent")(myQuery),
	Qgen_id_type:require("./QT_ID_type")(myQuery),
	Qgen_student_license:require("./Qstudent_license")(myQuery),
	Qgen_student_notes:require("./Qstudent_note")(myQuery),
	Qgen_category:require("./QT_category")(myQuery),
	Qgen_examiner:require("./Qexaminer")(myQuery),
	Qgen_examiner_qualification:require("./Qexaminer_qualification")(myQuery),
	Qgen_exam_type:require("./Qexam_type")(myQuery),
	Qgen_exam_price:require("./Qexam_price")(myQuery),
	Qgen_booked:require("./Qbooked")(myQuery),
	Qgen_exam_routes:require("./Qexam_routes")(myQuery),
	Qgen_exam:require("./Qexam")(myQuery),
	Qgen_pauta:require("./Qpauta")(myQuery),
	Qgen_exam_results:require("./QT_exam_results")(myQuery),
	Qgen_exam_status:require("./QT_exam_status")(myQuery),
	Qgen_work_hours:require("./Qwork_hours")(myQuery),
	Qgen_pendent_payments:require("./Qpendent_payment")(myQuery),
	Qgen_transactions:require("./Qtransactions")(myQuery),
	Qgen_timeslot:require("./Qtimeslot")(myQuery),
	Qgen_delegation:require("./QT_delegation")(myQuery),
	Qgen_bank:require("./Qbanks")(myQuery),
	Qgen_tax:require("./QT_tax")(myQuery),
	Qgen_payment_method:require("./Qpayment_method")(myQuery),
	Qgen_payment:require("./Qpayment")(myQuery),
	Qgen_reservations:require("./Qreservations")(myQuery),
	Qgen_groups:require("./Qgroups")(myQuery),
	Qgen_temp_student:require("./Qtemp_student")(myQuery),
	Qgen_imtt:require("./Qimtt")(myQuery),
	Qgen_sicc_status:require("./Qsicc_status")(myQuery),
	Qgen_balance:require("./Qbalance")(myQuery)
}

// myQuery= function(queryString, values, callback){
// 	pool.getConnection(function(err, connection) {
// 		if(pool){
// 			callback	
// 		}else{
// 			callback(True);
// 		}	
// 	}	
// };

// myQuerySequence = function(callback){
// 		pool.getConnection(function(err, connection) {
// 			if(pool){
// 				connection.beginTransaction(function(err) {
// 				//Transaction Error (Rollback and release connection)
// 				if (err) {                  
// 		        	connection.rollback(function() {
// 		                connection.release();
// 		                callback(err)
// 		        	});
// 		    	}else{
// 		    		//execute the queryString
// 		 			connection.query(queryString, values, function(error,results,fields){
// 		 				if(error){
// 		 					//Failure
// 		 					connection.rollback(function() {
// 		                        connection.release();
// 		                        callback(error);
// 	                    	});
// 				 		}else{
// 				 			// console.log("4. We have query results: " + JSON.stringify(results));
// 				 			callback(false, results);
// 				 		}
// 		    		}
// 				}






// 		});

// 			// not connected!
// 			if (err) throw err;
// 		 	// Use the connection
// 		  	// console.log('3. We have pool and the connection thread id is ' + connection.threadId);
// 		 	//execute the queryString
// 		 	connection.query(queryString, values, function(error,results,fields){
// 		 		if(error){
// 		 			callback(error)
// 		 		}else{
// 		 			// console.log("4. We have query results: " + JSON.stringify(results));
// 		 			callback(false, results);
// 		 		}
// 		 	});
// 		 	connection.release();
// 		});
// 	}else{
// 		callback(True);
// 	}
// };






// function executeTransaction(queries) {
//     try {
//       const connection = yield getConnectionObj({/* your db params to get connection */)
  
//       let results = []

//       return new Promise(function(resolve, reject) {
//         connection.beginTransaction(function (err) {
//           if (err) throw err

//           console.log("Starting transaction")

//           queries
//             .reduce(function (sequence, queryToRun) {
//               return sequence.then(function () {
//                 /* pass your query and connection to a helper function and execute query there */
//                 return queryConnection(
//                   connection,
//                   query,
//                   queryParams,
//                 ).then(function (res) {
//                   /* Accumulate resposes of all queries */
//                   results = results.concat(res)
//                 })
//               }).catch(function (error) {
//                 reject(error)
//               })
//             }, Promise.resolve())
//             .then(function () {
//               connection.commit(function (err) {
//                 if (err) {
//                   connection.rollback(function () {
//                     throw err
//                   })
//                 }
//                 console.log('Transactions were completed!')
//                 /* release connection */
//                 connection.release()
//                 /* resolve promise with all results */
//                 resolve({ results })
//               })
//             })
//             .catch(function (err) {
//               console.log('Transaction failed!')
//               connection.rollback(function () {
//                 console.log('Abort Transaction !!!')
//                 throw err
//               })
//             })
//         })
//       })
//    /* End Transaction */

//     } catch (error) {
//       return Promise.reject(error)
//     }
//   }




// myQuery = function(queryString, values, callback){
// 	if(pool){
// 		pool.getConnection(function(err, connection) {
// 			// not connected!
// 			if (err) throw err;
// 		 	// Use the connection
// 		  	// console.log('3. We have pool and the connection thread id is ' + connection.threadId);
// 		 	//execute the queryString
// 		 	connection.query(queryString, values, function(error,results,fields){
// 		 		if(error){
// 		 			callback(error)
// 		 		}else{
// 		 			// console.log("4. We have query results: " + JSON.stringify(results));
// 		 			callback(false, results);
// 		 		}
// 		 	});
// 		 	connection.release();
// 		});
// 	}else{
// 		callback(True);
// 	}
// };





// connection.connect(function(err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack);
//     return;
//   }
//   console.log('connected as id ' + connection.threadId);
// });
 
// /* Begin transaction */
// connection.beginTransaction(function(err) {
//   if (err) { throw err; }
//   connection.query('INSERT INTO names SET name=?', "sameer", function(err, result) {
//     if (err) { 
//       connection.rollback(function() {
//         throw err;
//       });
//     }
 
//     var log = result.insertId;
 
//     connection.query('INSERT INTO log SET logid=?', log, function(err, result) {
//       if (err) { 
//         connection.rollback(function() {
//           throw err;
//         });
//       }  
//       connection.commit(function(err) {
//         if (err) { 
//           connection.rollback(function() {
//             throw err;
//           });
//         }
//         console.log('Transaction Complete.');
//         connection.end();
//       });
//     });
//   });
// });
// /* End transaction */

// var getConnectionSequence=function(err, connection){
// 	if(pool){
// 		pool.getConnection(function(err, connection) {
// 			// not connected!
// 			if (err) throw err;
// 		 	// Use the connection
// 		 	/* Begin transaction */
// 			// connection.beginTransaction(function(err) {
// 			// 	//Transaction Error (Rollback and release connection)
// 			// 	if (err) {
// 			// 		connection.rollback(function() {
// 		 //                connection.release();
// 		 //                callback(err)
// 		 //        	});
// 			// 	};
// 			// });
// 		});
// 		callback(false,connection);
// 	}else{
// 		callback(True);
// 	};
// };

// myQuery2 = function(connection,queryString, values, callback){
// 	connection.query(queryString, values, function(error,results,fields){
//  		if(error){
//  			callback(error);
//  		}else{
//  			callback(false, results);
//  		}
//  	});
// };
