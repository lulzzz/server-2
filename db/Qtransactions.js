// get all records in Transactions
var Qget_AllTransactions = (cb)=>{
	return myQuery('SELECT transactions.*,Payment_method.Name '+ 
					'FROM transactions,Payment_method '+
					'WHERE transactions.Payment_method_idPayment_method=Payment_method.idPayment_method',
					null,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get all records in Transactions given exam_center
var Qget_AllTransactions_Exam_Center = (idexam_center,cb)=>{
	return myQuery('SELECT transactions.*,Payment_method.Name '+ 
					'FROM transactions,Payment_method '+
					'WHERE transactions.Payment_method_idPayment_method=Payment_method.idPayment_method '+
					'AND transactions.Exam_center_idExam_center= ?',[idexam_center],
					(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get all records in Transactions given school
var Qget_AllTransactions_School = (idexam_center,idschool,cb)=>{
	return myQuery('SELECT transactions.*,Payment_method.Name '+ 
					'FROM transactions,Payment_method '+
					'WHERE transactions.Payment_method_idPayment_method=Payment_method.idPayment_method '+
					'AND transactions.Exam_center_idExam_center= ? AND transactions.School_idSchool= ?',
					[idexam_center,idschool],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get all records in Transactions not yet associated for given school
var Qget_AllUnusedTransactions_School = (idexam_center,idschool,cb)=>{
	return myQuery('SELECT transactions.*,Payment_method.Name '+ 
					'FROM transactions,Payment_method '+
					'WHERE transactions.Payment_method_idPayment_method=Payment_method.idPayment_method '+
					'AND transactions.Payments_idPayments IS NULL '+
					'AND transactions.Exam_center_idExam_center= ? AND transactions.School_idSchool= ?',
					[idexam_center,idschool],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get all records in transactions for given payment
var Qget_ByPayment_Transactions = (idpayment,cb)=>{
	return myQuery('SELECT transactions.*,Payment_method.Name '+ 
					'FROM transactions,Payment_method '+
					'WHERE transactions.Payment_method_idPayment_method=Payment_method.idPayment_method '+
					'AND transactions.Payments_idPayments =?',
					[idpayment],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byNotUsued_Transaction = (idexam_center,idschool,cb)=>{
		return myQuery('SELECT transactions.*,Payment_method.Name ' + 
					'FROM transactions,Payment_method ' +
					'WHERE transactions.Payment_method_idPayment_method=Payment_method.idPayment_method ' +
					'AND transactions.Exam_center_idExam_center= ? AND transactions.School_idSchool= ?' + 
					'AND transactions.Payments_idPayments IS NULL',
					[idexam_center,idschool],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// put record in transactions
var Qcreate_Transactions=(values,cb)=>{
	return myQuery('INSERT INTO transactions (Transaction_num,Transaction_value,Transaction_date,'+
					'Exam_center_idExam_center,School_idSchool,Payment_method_idPayment_method,'+
					'T_Status_check_idT_Status_check,Banks_idBanks) values (?)',[values],
					(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// delete transaction by id
var Qdelete_Transaction=(id,cb)=>{
	return myQuery('DELETE FROM transactions WHERE idTransactions = ?',[id],(error,results,fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// patch transaction by id
var Qupdate_Transaction = (id,values,cb) =>{
	return myQuery('UPDATE transactions SET ? WHERE idTransactions = ?',[values,id],
					(error,results,fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// Associate transaction to payment
var Qupdate_Payment_Transaction = (id,id_payment,cb) =>{
	return myQuery('UPDATE transactions SET Payments_idPayments=? WHERE idTransactions = ?',[id_payment,id],
					(error,results,fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

module.exports = function(myQuery){
	return {
		Qget_AllTransactions,
		Qget_AllTransactions_Exam_Center,
		Qget_AllTransactions_School,
		Qget_AllUnusedTransactions_School,
		Qget_ByPayment_Transactions,
		Qget_byNotUsued_Transaction,
		Qcreate_Transactions,
		Qdelete_Transaction,
		Qupdate_Transaction,
		Qupdate_Payment_Transaction
	}
}