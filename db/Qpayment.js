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
					'AND School.Exam_center_idExam_center=? '+
        		'UNION '+ 
        		'SELECT payment.*,temp_student.School_Permit,School.school_name '+
        		'FROM payment,pendent_payments,school,reservation,temp_student '+
        		'WHERE payment.idPayment=pendent_payments.Payments_idPayments '+
        			'AND pendent_payments.Reservation_idReservation=Reservation.idReservation '+
                    'AND temp_student.Reservation_idReservation=Reservation.idReservation '+
					'AND temp_student.School_Permit=School.Permit '+
					'AND School.Exam_center_idExam_center=?',
					[idexam_center,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get all payments for given exam_center without invoice
var Qget_NOINV_ByExam_center_Payments=(idexam_center,cb)=>{
	return myQuery(`SELECT * FROM 
			(SELECT payment.*,school.Permit,school.school_name 
			FROM payment,Student_license,pendent_payments,school 
			WHERE payment.idPayment=pendent_payments.Payments_idPayments 
				AND pendent_payments.Student_license_idStudent_license=Student_license.idStudent_license 
				AND Student_license.School_idSchool=School.idSchool 
				AND School.Exam_center_idExam_center=?
			UNION 
			SELECT payment.*,temp_student.School_Permit,School.school_name 
			FROM payment,pendent_payments,school,reservation,temp_student 
			WHERE payment.idPayment=pendent_payments.Payments_idPayments 
				AND pendent_payments.Reservation_idReservation=Reservation.idReservation 
				AND temp_student.Reservation_idReservation=Reservation.idReservation 
				AND temp_student.School_Permit=School.Permit 
				AND School.Exam_center_idExam_center=?) AS pay
			WHERE pay.Invoice_num IS NULL`[idexam_center,idexam_center],
			(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get all payments for given exam_center with invoice
var Qget_INV_ByExam_center_Payments=(idexam_center,cb)=>{
	return myQuery(`SELECT * FROM 
			(SELECT payment.*,school.Permit,school.school_name 
			FROM payment,Student_license,pendent_payments,school 
			WHERE payment.idPayment=pendent_payments.Payments_idPayments 
				AND pendent_payments.Student_license_idStudent_license=Student_license.idStudent_license 
				AND Student_license.School_idSchool=School.idSchool 
				AND School.Exam_center_idExam_center=?
			UNION 
			SELECT payment.*,temp_student.School_Permit,School.school_name 
			FROM payment,pendent_payments,school,reservation,temp_student 
			WHERE payment.idPayment=pendent_payments.Payments_idPayments 
				AND pendent_payments.Reservation_idReservation=Reservation.idReservation 
				AND temp_student.Reservation_idReservation=Reservation.idReservation 
				AND temp_student.School_Permit=School.Permit 
				AND School.Exam_center_idExam_center=?) AS pay
			WHERE pay.Invoice_num IS NOT NULL`[idexam_center,idexam_center],
			(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};



// get all payment available for given school
var Qget_byId_Payments = (id,cb)=>{
	return myQuery('SELECT payment.*,school.Email1,school.Email2 FROM payment,transactions,school '+
				'WHERE transactions.Payments_idPayments=Payment.idPayment AND school.idschool=school_idschool AND payment.idPayment=?',
				[id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_Payments_without_invoice = (idexam_center,cb)=>{
	return myQuery('SELECT payment.* FROM payment,transactions '+
						'WHERE invoice_num IS NULL AND transactions.Exam_center_idExam_center = ? '+
						'GROUP BY payment.idPayment',[idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

// get payments to be invoice
var Qget_PaymentsInvoice = (idpayment,idexam_center,cb)=>{
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

// get payment which invoices werent sent to schools yet
var Qget_InvoiceToSend = (permit,idexam_center,cb)=>{
	return myQuery(`SELECT payment.*, transactions.*
			FROM payment, transactions, school
			WHERE transactions.Payments_idPayments = payment.idpayment
        		AND transactions.School_idSchool = School.idSchool
        		AND School.permit = ? AND payment.Invoice_sent = 0
        		AND payment.Invoice_num IS NOT NULL
        		AND School.Exam_center_idExam_center=?`,
			[permit,idexam_center],(error, results, fields)=>{
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
		Qget_NOINV_ByExam_center_Payments,
		Qget_INV_ByExam_center_Payments,
		Qget_Payments_without_invoice,
		Qget_PaymentsInvoice,
		Qget_InvoiceToSend,
		Qcreate_Payment,
		Qdelete_Payment,
		Qpatch_Payment,
		Qpatch_invoice_Payments,
		Qget_search
	}
}
