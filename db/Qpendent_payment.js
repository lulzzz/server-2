// get all records in Pendent Payments
var Qget_AllPendentPayments = (cb)=>{
	return myQuery('SELECT * FROM pendent_payments',null,(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all records in Pendent Payments given exam_center
var Qget_AllPendentPayments_Exam_Center = (idexam_center,cb)=>{
	return myQuery('SELECT pendent_payments.*,Student.Student_name,Student.Student_num,'+
					'exam_type.Exam_type_name,Timeslot.Timeslot_date '+
					'FROM pendent_payments,Student_license,Student,School,Booked,Exam_type,Timeslot '+
					'WHERE pendent_payments.Student_license_idStudent_license=student_license.idStudent_license '+
					'AND student_license.School_idSchool = School.idSchool '+
					'AND student_license.Student_idStudent=Student.idStudent '+
					'AND Pendent_payments.Booked_idBooked=Booked.idBooked '+
					'AND Booked.Exam_type_idExam_type=Exam_type.idExam_type '+
					'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '+
					'AND Booked.Exam_center_idExam_center = ?',[idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in Pendent Payments
var Qget_byIdPendentPayment =(id,idexam_center,scb)=>{
	return myQuery('SELECT pendent_payments.*,Student.Student_name,Student.Student_num,'+
					'exam_type.Exam_type_name,Timeslot.Timeslot_date '+
					'FROM pendent_payments,Student_license,Student,School,Booked,Exam_type,Timeslot '+
					'WHERE pendent_payments.Student_license_idStudent_license=student_license.idStudent_license '+
					'AND student_license.School_idSchool = School.idSchool '+
					'AND student_license.Student_idStudent=Student.idStudent '+
					'AND Pendent_payments.Booked_idBooked=Booked.idBooked '+
					'AND Booked.Exam_type_idExam_type=Exam_type.idExam_type '+
					'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '+
					'AND pendent_payments.idpendent_payments = ? '+
					'AND Booked.Exam_center_idExam_center = ?',[id,idexam_center],
					(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in Pendent Payments
var Qget_byIdSchool_PendentPayment =(idschool,idexam_center,cb)=>{
	return myQuery('SELECT pendent_payments.*,Student.Student_name,Student.Student_num,'+
			'exam_type.Exam_type_name,Timeslot.Timeslot_date '+
			'FROM pendent_payments,Student_license,Student,School,Booked,Exam_type,Timeslot '+
			'WHERE pendent_payments.Student_license_idStudent_license=student_license.idStudent_license '+
			'AND student_license.School_idSchool = School.idSchool '+
			'AND student_license.Student_idStudent=Student.idStudent '+
			'AND Pendent_payments.Booked_idBooked=Booked.idBooked '+
			'AND Booked.Exam_type_idExam_type=Exam_type.idExam_type '+
			'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '+
			'AND School.idSchool = ? AND School.Exam_center_idExam_center=?',
			[idschool,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in Pendent Payments
var Qget_bySchool_UnusedPendentPayment =(idschool,idexam_center,cb)=>{
	return myQuery('SELECT pendent_payments.*,Student.Student_name,Student.Student_num,'+
			'exam_type.Exam_type_name,Timeslot.Timeslot_date '+
			'FROM pendent_payments,Student_license,Student,School,Booked,Exam_type,Timeslot '+
			'WHERE pendent_payments.Student_license_idStudent_license=student_license.idStudent_license '+
			'AND student_license.School_idSchool = School.idSchool '+
			'AND student_license.Student_idStudent=Student.idStudent '+
			'AND Pendent_payments.Booked_idBooked=Booked.idBooked '+
			'AND Booked.Exam_type_idExam_type=Exam_type.idExam_type '+
			'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '+
			'AND pendent_payments.Payments_idPayments IS NULL '+
			'AND School.idSchool = ? AND School.Exam_center_idExam_center=?',
			[idschool,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in Pendent Payments
var Qget_byIdPayment_PendentPayment =(idpayment,cb)=>{
	return myQuery('SELECT pendent_payments.*,Student.Student_name,Student.Student_num,'+
			'exam_type.Exam_type_name,Timeslot.Timeslot_date '+
			'FROM pendent_payments,Student_license,Student,School,Booked,Exam_type,Timeslot '+
			'WHERE pendent_payments.Student_license_idStudent_license=student_license.idStudent_license '+
			'AND student_license.School_idSchool = School.idSchool '+
			'AND student_license.Student_idStudent=Student.idStudent '+
			'AND Pendent_payments.Booked_idBooked=Booked.idBooked '+
			'AND Booked.Exam_type_idExam_type=Exam_type.idExam_type '+
			'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '+
			'AND pendent_payments.Payments_idPayments=?',
			[idpayment],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byExam_Center_Tax=(idexam_center,cb)=>{
		return myQuery('SELECT Student.Student_num, Student.Student_name, School.Permit, Type_category.Category '+
					'FROM Pendent_payments '+
					'LEFT JOIN booked ON pendent_payments.Booked_idBooked=Booked.idBooked '+
					'LEFT JOIN student_license ON Booked.Student_license_idStudent_license=Student_license.idStudent_license '+
					'LEFT JOIN school ON Student_license.School_idSchool=School.idSchool '+
					'LEFT JOIN student ON Student_license.Student_idStudent=Student.idStudent '+
					'LEFT JOIN Type_category ON Student_license.Type_category_idType_category=Type_category.idType_category '+
					'WHERE pendent_payments.Tax_price IS NOT NULL',[idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byNotPaid_Exam=(idexam_center,idschool,cb)=>{
		return myQuery('SELECT pendent_payments.*,Student.Student_name,Student.Student_num,'+
				'exam_type.Exam_type_name,Timeslot.Timeslot_date '+
				'FROM pendent_payments,Student_license,Student,School,Booked,Exam_type,Timeslot '+
				'WHERE pendent_payments.Student_license_idStudent_license=student_license.idStudent_license '+
				'AND student_license.School_idSchool = School.idSchool '+
				'AND student_license.Student_idStudent=Student.idStudent '+
				'AND Pendent_payments.Booked_idBooked=Booked.idBooked '+
				'AND Booked.Exam_type_idExam_type=Exam_type.idExam_type '+
				'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '+
				'AND School.idSchool = ? AND School.Exam_center_idExam_center=?' + 
				'AND pendent_payments.Payments_idPayments IS NULL ' + 
				'AND pendent_payments.Exam_price IS NOT NULL ',[idschool,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byNotPaid_Tax=(idexam_center,cb)=>{
		return myQuery('SELECT pendent_payments.*,Student.Student_name,Student.Student_num,'+
				'exam_type.Exam_type_name,Timeslot.Timeslot_date '+
				'FROM pendent_payments,Student_license,Student,School,Booked,Exam_type,Timeslot '+
				'WHERE pendent_payments.Student_license_idStudent_license=student_license.idStudent_license '+
				'AND student_license.School_idSchool = School.idSchool '+
				'AND student_license.Student_idStudent=Student.idStudent '+
				'AND Pendent_payments.Booked_idBooked=Booked.idBooked '+
				'AND Booked.Exam_type_idExam_type=Exam_type.idExam_type '+
				'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '+
				'AND pendent_payments.Payments_idPayments IS NULL ' + 
				'AND pendent_payments.Tax_price IS NOT NULL ',[idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get easyPay references that don't have a payment
var Qget_pendentPaymentsEasyPay = (cb) => {
	return myQuery('SELECT idEasyPay FROM pendent_payments ' +
		'Inner join reservation on pendent_payments.Reservation_idReservation = reservation.idReservation ' +
		'Where pendent_payments.Payments_idPayments is NULL ' +
		'AND pendent_payments.Exam_price IS NOT NULL ' +
		'AND reservation.idEasypay IS NOT NULL', null, (error, results, fields) => {
			error ? cb(error) : cb(false, results);
		});
};

// create pendent payment with exam price
var Qcreate_PendentPayment_exam=(price,idbooking,idstudent_license,cb)=>{
	return myQuery('INSERT INTO pendent_payments (Exam_price,Booked_idBooked,'+
						'Student_license_idStudent_license) VALUES (?,?,?)',
						[price,idbooking,idstudent_license],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// create pendent payment with tax price
var Qcreate_PendentPayment_tax=(price,idbooking,idstudent_license,cb)=>{
	return myQuery('INSERT INTO pendent_payments (Tax_price,Booked_idBooked,'+
						'Student_license_idStudent_license) VALUES (?,?,?)',
						[price,idbooking,idstudent_license],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// create pendent payment with exam price from reservation
var Qcreate_PendentPayment_reservation=(price,idreservation,cb)=>{
	return myQuery('INSERT INTO pendent_payments (Exam_price,Reservation_idReservation) VALUES (?,?)',
						[price,idreservation],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};


var Qdelete_PendentPayment=(id,cb)=>{
	return myQuery('DELETE FROM pendent_payments WHERE idPendent_payments = ?',[id],
					(error,results,fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

var Qpatch_Payment_PendentPayment=(id,id_payment,cb)=>{
	return myQuery('UPDATE pendent_payments SET Payments_idPayments = ? WHERE idPendent_payments = ?',
					[id_payment,id],(error,results,fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

// patch pendentpayment
var Qpatch_PendentPaymentValues = (values,idPendentPayment,cb)=>{
	return myQuery('UPDATE pendent_payments SET ? WHERE idPendent_payments=?'
					,[values,idPendentPayment],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

module.exports = function(myQuery){
	return {
		Qget_AllPendentPayments,
		Qget_AllPendentPayments_Exam_Center,
		Qget_byIdSchool_PendentPayment,
		Qget_byIdPendentPayment,
		Qget_bySchool_UnusedPendentPayment,
		Qget_byIdPayment_PendentPayment,
		Qget_byExam_Center_Tax,
		Qget_byNotPaid_Exam,
		Qget_byNotPaid_Tax,
		Qget_pendentPaymentsEasyPay,
		Qcreate_PendentPayment_exam,
		Qcreate_PendentPayment_tax,
		Qcreate_PendentPayment_reservation,
		Qdelete_PendentPayment,
		Qpatch_Payment_PendentPayment,
		Qpatch_PendentPaymentValues
	}
}