// get all payment available
var Qget_AllPayments = (cb)=>{
	return myQuery('SELECT * FROM payment',null,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get all payment available for given school
var Qget_AllByExam_Center_Payments = (idexam_center,cb)=>{
	return myQuery('SELECT payment.*,school.Permit,school.school_name '+
				'FROM payment,Student_license,pendent_payments,school ' +
				'WHERE payment.idPayment=pendent_payments.Payments_idPayments '+
					'AND pendent_payments.Student_license_idStudent_license=Student_license.idStudent_license '+
					'AND Student_license.School_idSchool=School.idSchool ' +
					'AND School.Exam_center_idExam_center=? ',
					[idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get all payment available for given school
var Qget_byId_Payments = (id,cb)=>{
	return myQuery('SELECT payment.* FROM payment WHERE payment.idPayment=? ',[id],
						(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_Payments_without_invoice=(idexam_center,cb)=>{
	return myQuery('SELECT payment.* FROM payment,transactions '+
						'WHERE invoice_num IS NULL AND transactions.Exam_center_idExam_center = ? '+
						'GROUP BY payment.idPayment',[idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

// get payments to be invoice
var Qget_PaymentsInvoice=(idpayment,idexam_center,cb)=>{
	return myQuery('SELECT payments_to_invoice.*, COUNT(pendent_payments.idPendent_payments) AS `Quantity`,school.permit '+
			'FROM payments_to_invoice,Transactions,school, pendent_payments '+
			'WHERE payments_to_invoice.idPayment=Transactions.Payments_idPayments '+
			'AND Transactions.School_idSchool=School.idSchool '+
            'AND pendent_payments.Payments_idPayments=payments_to_invoice.idPayment '+
			'AND payments_to_invoice.idPayment = ? AND payments_to_invoice.Exam_center_idExam_center = ? '+
			'GROUP BY payments_to_invoice.exam_type_code, payments_to_invoice.base_value, payments_to_invoice.idPayment',
			[idpayment,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// create payment
var Qcreate_Payment = (values,cb)=>{
	return myQuery('INSERT INTO payment (Payment_date,Total_value) VALUES (?)',[values],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// delete payment
var Qdelete_Payment = (idpayment,values,cb)=>{
	return myQuery('DELETE FROM payment Where idPayment=?',[values],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// patch payment
var Qpatch_Payment = (idpayment,values,cb)=>{
	return myQuery('UPDATE payment SET ? WHERE idPayment=?',[values,idpayment],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// patch invoice reference for given payment id
var Qpatch_invoice_Payments=(idpayment,invoice,cb)=>{
	// console.log(idpayment)
	// console.log(invoice)
	return myQuery('UPDATE payment SET Invoice_num = ? WHERE idPayment = ?',[invoice,idpayment],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// -----------------------------------ADVANCE SEARCH------------------------------------------
var Qget_search=(query,values,cb)=>{
	let customQuery='SELECT payment.*,Pendent_payments.*,Transactions.*,School.* '+
				'FROM payment,Pendent_payments,Transactions,T_Status_check,School'+
				'WHERE payment.idpayment = Transactions.Payments_idPayments '+
				'AND payment.idpayment = Pendent_payments.Payments_idPayments '+
				'AND Transactions.T_Status_check_idT_Status_check = T_Status_check.idT_Status_check '+
				'AND Transactions.School_idSchool = School.idSchool '+
		        'AND ' + query;
	return myQuery(customQuery,values,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

module.exports = function(myQuery){
	return {
		Qget_AllPayments,
		Qget_AllByExam_Center_Payments,
		Qget_byId_Payments,
		Qget_Payments_without_invoice,
		Qget_PaymentsInvoice,
		Qcreate_Payment,
		Qdelete_Payment,
		Qpatch_Payment,
		Qpatch_invoice_Payments,
		Qget_search
	}
}



// // get all payment available for given school
// var Qget_byId_Payments = (cb)=>{
// 	return myQuery('SELECT payment.*, Transactions.*, pendent_payments.*, Student.Student_name, '+
// 						'Student.Student_num, exam_type.Exam_type_name, Timeslot.Timeslot_date, '+
// 						'Payment_method.Name,school.School_name '+
// 					'FROM payment,Transactions,pendent_payments,Student_license,Student,Booked,'+
// 						'exam_type,Timeslot,Payment_method,school '+
// 					'WHERE payment.idPayment=Transactions.Payments_idPayments '+
// 						'AND payment.idPayment=pendent_payments.Payments_idPayments '+
// 						'AND Transactions.Payment_method_idPayment_method=Payment_method.idPayment_method '+
// 						'AND pendent_payments.Student_license_idStudent_license=Student_license.idStudent_license '+
// 						'AND Student_license.Student_idStudent=Student.idStudent '+
// 						'AND Student_license.School_idSchool=School.idSchool '+
// 						'AND Booked.Student_license_idStudent_license=Student_license.idStudent_license '+
// 						'AND Booked.Exam_type_idExam_type=Exam_type.idExam_type '+
// 						'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '
// 						,null,(error, results, fields)=>{
// 		error ? cb(error) : cb(false,results);
// 	});
// };

