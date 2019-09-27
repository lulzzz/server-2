// get all records in bookings
var Qget_AllBookings = (cb)=>{
	return myQuery('SELECT Booked.*,Exam_type.Exam_type_name,T_exam_status.Status,'+
			'Student.Student_name,Student.ID_num,School.Permit,Timeslot.* '+
			'FROM Booked,Student_license,Student,School,T_exam_status,Exam_type,Timeslot '+
			'WHERE Student_license.idStudent_license=Booked.Student_license_idStudent_license AND '+
			'Student_license.Student_idStudent=Student.idStudent '+
			'AND Student_license.School_idSchool=School.idSchool '+
			'AND Booked.T_exam_status_idexam_status=T_exam_status.idexam_status '+
			'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '+
			'AND Booked.Exam_type_idExam_type = Exam_type.idExam_type AND Student_license.Active=1',
			null,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get all records in bookings given exam_center
var Qget_AllBookings_Exam_Center = (idexam_center,cb)=>{
	return myQuery('SELECT Booked.*,Exam_type.Exam_type_name,T_exam_status.Status,'+
			'Student.Student_name,Student.ID_num,School.Permit,timeslot.Timeslot_date,'+
			'timeslot.Begin_time,timeslot.End_time,timeslot.Exam_group '+
			'FROM Booked,Student_license,Student,School,T_exam_status,Exam_type,Timeslot '+
			'WHERE Student_license.idStudent_license=Booked.Student_license_idStudent_license AND '+
			'Student_license.Student_idStudent=Student.idStudent '+
			'AND Student_license.School_idSchool=School.idSchool '+
			'AND Booked.T_exam_status_idexam_status=T_exam_status.idexam_status '+
			'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '+
			'AND Booked.Exam_type_idExam_type = Exam_type.idExam_type AND Student_license.Active=1 '+
			'AND Booked.Exam_center_idExam_center = ?',[idexam_center],
			(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in bookings
var Qget_byIdBooking_Exam_Center =(id,idexam_center, cb)=>{
	return myQuery('SELECT Booked.*,T_exam_status.Status,Exam_type.Exam_type_name,'+
			'Student_license.*,Student.*, t_id_type.ID_name, type_category.Category,'+
			'School.idSchool,School.Permit,School.Associate_num,School.School_name,timeslot.Timeslot_date,'+
			'timeslot.Begin_time,timeslot.End_time,timeslot.Exam_group '+
			'FROM Booked,Student_license,Student,School,type_category,t_id_type,T_exam_status,Exam_type,timeslot '+
			'WHERE Student_license.idStudent_license=Booked.Student_license_idStudent_license  '+
			'AND Student_license.Type_category_idType_category=type_category.idType_category '+
			'AND Student_license.Student_idStudent=Student.idStudent '+
			'AND Student_license.School_idSchool=School.idSchool '+
			'AND Booked.Exam_type_idExam_type = Exam_type.idExam_type '+
			'AND Student.T_ID_type_idT_ID_type=t_id_type.idT_ID_type '+
			'AND Booked.Timeslot_idTimeslot=Timeslot.idTimeslot '+
			'AND Booked.T_exam_status_idexam_status=T_exam_status.idexam_status '+
			'AND Student_license.Active=1 AND Booked.idBooked = ? '+
			'AND Booked.Exam_center_idExam_center = ? LIMIT 1',
			[id,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in bookings
var Qget_byIdBooking =(id,cb)=>{
	return myQuery('SELECT * FROM Booked WHERE Booked.idBooked = ? LIMIT 1',[id],
					(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byTimeslot_Count_Booking = (idtimeslot,cb)=>{
	return myQuery('SELECT COUNT(idbooked) AS bookings FROM booked '+
					'WHERE Timeslot_idTimeslot=? LIMIT 1',[idtimeslot],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by exam date in bookings
var Qget_byExamDateBooking_Exam_Center =(exam_date,idexam_center, cb)=>{
	return myQuery('SELECT * FROM Booked WHERE Exam_date = ? and Exam_center_idExam_center = ?',
								[exam_date,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by Associate_num in bookings
var Qget_byExamNumBooking_Exam_Center =(exam_num,idexam_center, cb)=>{
	return myQuery('SELECT * FROM Booked WHERE Exam_num = ? and Exam_center_idExam_center = ?',
								[exam_num,idexam_center], (error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};


var Qget_PautaNum=(exam_date,exam_group,cb)=>{
	return myQuery('SELECT Pauta_num FROM Booked WHERE Exam_date=? and Exam_group=? Limit 1',[exam_date,exam_group],
								(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
}

var Qget_nextPautaNum=(cb)=>{
	return myQuery('SELECT IFNULL(MAX(Pauta_num+1),0) AS Pauta_num FROM Booked',null,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
}

var Qget_ValuesCreateExam=(idtimeslot,cb)=>{
	return myQuery('SELECT booked.idBooked `Booked_idBooked`,pauta.idPauta `Pauta_idPauta`, '+
					'booked.Exam_type_idExam_type `Exam_type_idExam_type`, '+
					'booked.Student_license_idStudent_license `Student_license_idStudent_license` '+
					'FROM booked LEFT JOIN timeslot '+
					'ON booked.Timeslot_idTimeslot=timeslot.idTimeslot LEFT JOIN pauta '+
					'ON pauta.Timeslot_idTimeslot=timeslot.idTimeslot '+
					'WHERE timeslot.idTimeslot=? GROUP BY booked.idBooked',[idtimeslot],
					(error, results, fields)=>{
		error ? cb(error) : cb(false,results);					
	});
}

// put record in bookings given exam_center id
var Qcreate_Booking=(values,cb)=>{
	return myQuery('INSERT INTO Booked (Booked_date,Obs,Student_license_idStudent_license,'+
							'Timeslot_idTimeslot,Account_idAccount,Exam_center_idExam_center,'+
							'Exam_type_idExam_type,T_exam_status_idexam_status,sicc_status_idsicc_status) '+
							'values (?)',[values],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);	
	});
};

// delete record by id in bookings
var Qdelete_byIdBooking=(id,cb)=>{
	return myQuery('DELETE FROM Booked WHERE idBooked = ?',[id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);
	})
};

// update record in bookings
var Qupdate_byIdBooking=(id,values,cb)=>{
	return myQuery('UPDATE Booked SET ? where idBooked=?',[values,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// update record in bookings for exam number
var Qupdate_Booking_ExamNum=(id,exam_num,cb)=>{
	return myQuery('UPDATE Booked SET Exam_num=? where idBooked=?',[exam_num,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// update record in bookings for exam number
var Qupdate_Booking_SiccStatus=(id,operation,cb)=>{
	return myQuery("UPDATE booked SET sicc_status_idsicc_status = " +
						"(SELECT idsicc_status FROM t_sicc_status WHERE process = 1 AND operation = ?) " +
                        "WHERE idBooked = ?",[operation,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// -----------------------------------ADVANCE SEARCH------------------------------------------
var Qget_search=(query,values,cb)=>{
	let customQuery='SELECT Booked.*, timeslot.*, student.*'+
			'FROM Booked '+
			    'LEFT JOIN Timeslot on Booked.Timeslot_idTimeslot = Timeslot.idTimeslot '+
			    'LEFT JOIN Pendent_payments on Booked.idBooked = Pendent_payments.Booked_idBooked '+
				'LEFT JOIN Pauta on Timeslot.idTimeslot = Pauta.Timeslot_idTimeslot '+
			    'LEFT JOIN student_license on Booked.Student_license_idStudent_license = Student_license.idStudent_license '+
			    'LEFT JOIN School on Student_license.School_idSchool = School.idSchool '+
				'LEFT JOIN Student on Student_license.Student_idStudent = Student.idStudent '+
			    'LEFT JOIN Exam_type on Booked.Exam_type_idExam_type = Exam_type.idExam_type '+
			    'LEFT JOIN type_category on Exam_type.Type_category_idType_category = Type_category.idType_category '+
			'WHERE ' + query;
	return myQuery(customQuery,values,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

module.exports = function(myQuery){
	return {
		Qget_AllBookings,
		Qget_AllBookings_Exam_Center,
		Qget_byIdBooking_Exam_Center,
		Qget_byIdBooking,
		Qget_byExamDateBooking_Exam_Center,
		Qget_byExamNumBooking_Exam_Center,
		Qget_byTimeslot_Count_Booking,
		Qget_PautaNum,
		Qget_nextPautaNum,
		Qget_ValuesCreateExam,
		Qcreate_Booking,
		Qdelete_byIdBooking,
		Qupdate_byIdBooking,
		Qupdate_Booking_ExamNum,
		Qupdate_Booking_SiccStatus,
		Qget_search
	};
};



// var Qget_specialBooking1=(idexam_center,date,cb)=>{
// 	return myQuery('SELECT Booked.*,timeslot.*,student.* '+
// 				'FROM Booked,type_category,Exam_type,timeslot,student_license,school,student '+
// 				'WHERE Booked.Exam_type_idExam_type = Exam_type.idExam_type '+
// 		        'AND Booked.Timeslot_idTimeslot = Timeslot.idTimeslot '+
// 				'AND Exam_type.Type_category_idType_category=Type_category.idType_category '+
// 		        'AND Booked.Student_license_idStudent_license=Student_license.idStudent_license '+
// 				'AND Student_license.School_idSchool=School.idSchool '+
// 				'AND Student_license.Student_idStudent=Student.idStudent '+
// 		        'AND Booked.Exam_center_idExam_center = ? '+
// 		        'AND Timeslot.Timeslot_date = ? ',
// 						[idexam_center,date],(error, results, fields)=>{
// 		error ? cb(error) : cb(false,results);
// 	});	
// };

// var Qget_specialBooking2=(idexam_center,cat,cb)=>{
// 	return myQuery('SELECT Booked.*,timeslot.*,student.* '+
// 				'FROM Booked,type_category,Exam_type,timeslot,student_license,school,student '+
// 				'WHERE Booked.Exam_type_idExam_type = Exam_type.idExam_type '+
// 		        'AND Booked.Timeslot_idTimeslot = Timeslot.idTimeslot '+
// 				'AND Exam_type.Type_category_idType_category=Type_category.idType_category '+
// 		        'AND Booked.Student_license_idStudent_license=Student_license.idStudent_license '+
// 				'AND Student_license.School_idSchool=School.idSchool '+
// 				'AND Student_license.Student_idStudent=Student.idStudent '+
// 		        'AND Booked.Exam_center_idExam_center = ? '+
// 		        'AND type_category.idType_category = ?' ,
// 						[idexam_center,cat],(error, results, fields)=>{
// 		error ? cb(error) : cb(false,results);
// 	});	
// };

// var Qget_specialBooking3=(idexam_center,permit,cb)=>{
// 	return myQuery('SELECT Booked.*,timeslot.*,student.* '+
// 				'FROM Booked,type_category,Exam_type,timeslot,student_license,school,student '+
// 				'WHERE Booked.Exam_type_idExam_type = Exam_type.idExam_type '+
// 		        'AND Booked.Timeslot_idTimeslot = Timeslot.idTimeslot '+
// 				'AND Exam_type.Type_category_idType_category=Type_category.idType_category '+
// 		        'AND Booked.Student_license_idStudent_license=Student_license.idStudent_license '+
// 				'AND Student_license.School_idSchool=School.idSchool '+
// 				'AND Student_license.Student_idStudent=Student.idStudent '+
// 		        'AND Booked.Exam_center_idExam_center = ? '+
// 		        'AND School.Permit = ?',
// 						[idexam_center,permit],(error, results, fields)=>{
// 		error ? cb(error) : cb(false,results);
// 	});	
// };

// var Qget_specialBooking4=(idexam_center,permit,cat,cb)=>{
// 	return myQuery('SELECT Booked.*,timeslot.*,student.* '+
// 				'FROM Booked,type_category,Exam_type,timeslot,student_license,school,student '+
// 				'WHERE Booked.Exam_type_idExam_type = Exam_type.idExam_type '+
// 		        'AND Booked.Timeslot_idTimeslot = Timeslot.idTimeslot '+
// 				'AND Exam_type.Type_category_idType_category=Type_category.idType_category '+
// 		        'AND Booked.Student_license_idStudent_license=Student_license.idStudent_license '+
// 				'AND Student_license.School_idSchool=School.idSchool '+
// 				'AND Student_license.Student_idStudent=Student.idStudent '+
// 		        'AND Booked.Exam_center_idExam_center = ? '+
// 		        'AND type_category.idType_category = ? '+
// 		        'AND School.Permit = ?',
// 						[idexam_center,permit,cat],(error, results, fields)=>{
// 		error ? cb(error) : cb(false,results);
// 	});	
// };

// var Qget_specialBooking5=(idexam_center,permit,date,cb)=>{
// 	return myQuery('SELECT Booked.*,timeslot.*,student.* '+
// 				'FROM Booked,type_category,Exam_type,timeslot,student_license,school,student '+
// 				'WHERE Booked.Exam_type_idExam_type = Exam_type.idExam_type '+
// 		        'AND Booked.Timeslot_idTimeslot = Timeslot.idTimeslot '+
// 				'AND Exam_type.Type_category_idType_category=Type_category.idType_category '+
// 		        'AND Booked.Student_license_idStudent_license=Student_license.idStudent_license '+
// 				'AND Student_license.School_idSchool=School.idSchool '+
// 				'AND Student_license.Student_idStudent=Student.idStudent '+
// 		        'AND Booked.Exam_center_idExam_center = ? '+
// 		        'AND Timeslot.Timeslot_date = ? '+
// 		        'AND School.Permit = ?',
// 						[idexam_center,permit,date],(error, results, fields)=>{
// 		error ? cb(error) : cb(false,results);
// 	});	
// };

// var Qget_specialBooking6=(idexam_center,cat,date,cb)=>{
// 	return myQuery('SELECT Booked.*,timeslot.*,student.* '+
// 				'FROM Booked,type_category,Exam_type,timeslot,student_license,school,student '+
// 				'WHERE Booked.Exam_type_idExam_type = Exam_type.idExam_type '+
// 		        'AND Booked.Timeslot_idTimeslot = Timeslot.idTimeslot '+
// 				'AND Exam_type.Type_category_idType_category=Type_category.idType_category '+
// 		        'AND Booked.Student_license_idStudent_license=Student_license.idStudent_license '+
// 				'AND Student_license.School_idSchool=School.idSchool '+
// 				'AND Student_license.Student_idStudent=Student.idStudent '+
// 		        'AND Booked.Exam_center_idExam_center = ? '+
// 		        'AND type_category.idType_category = ? '+
// 		        'AND Timeslot.Timeslot_date = ?',
// 						[idexam_center,cat,date],(error, results, fields)=>{
// 		error ? cb(error) : cb(false,results);
// 	});	
// };

// var Qget_specialBooking7=(idexam_center,cat,date,permit,cb)=>{
// 	return myQuery('SELECT Booked.*,timeslot.*,student.* '+
// 				'FROM Booked,type_category,Exam_type,timeslot,student_license,school,student '+
// 				'WHERE Booked.Exam_type_idExam_type = Exam_type.idExam_type '+
// 		        'AND Booked.Timeslot_idTimeslot = Timeslot.idTimeslot '+
// 				'AND Exam_type.Type_category_idType_category=Type_category.idType_category '+
// 		        'AND Booked.Student_license_idStudent_license=Student_license.idStudent_license '+
// 				'AND Student_license.School_idSchool=School.idSchool '+
// 				'AND Student_license.Student_idStudent=Student.idStudent '+
// 		        'AND Booked.Exam_center_idExam_center = ? '+
// 		        'AND type_category.idType_category = ? '+
// 		        'AND Timeslot.Timeslot_date = ? '+
// 		        'AND School.Permit = ?',
// 				[idexam_center,cat,date,permit],(error, results, fields)=>{
// 		error ? cb(error) : cb(false,results);
// 	});	
// };