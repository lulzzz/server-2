// get all records in exams
var Qget_AllPautas = (cb)=>{
	return myQuery('SELECT * FROM Pauta',null,(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all records in exams given exam_center
var Qget_byExam_Center_AllPautas = (idexam_center,cb)=>{
	return myQuery('SELECT Pauta.*,Timeslot.* FROM Pauta,Timeslot ' +
				'WHERE Pauta.Timeslot_idTimeslot=Timeslot.idTimeslot AND ' +
				'Timeslot.Exam_center_idExam_center = ?',[idexam_center],
					(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all records in exams given exam_center
// missing add info about everything related to that pauta
var Qget_byId_Exam_Center_Pauta = (idpauta,idexam_center,cb)=>{
	return myQuery('SELECT Pauta.*, Examiner.Examiner_name, Examiner.Num '+
					'FROM Pauta,Timeslot,examiner_qualifications,examiner WHERE Booked.Pauta_num=Pauta.Pauta_num AND '+
					'Pauta.Examiner_qualifications_idExaminer_qualifications=examiner_qualifications.idExaminer_qualifications AND '+
					'examiner_qualifications.Examiner_idExaminer=Examiner.idExaminer AND '+
					'Booked.Exam_center_idExam_center = ? AND idPauta = ? LIMIT 1',[idexam_center,idpauta],
					(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byIdPauta = (idpauta,cb)=>{
	return myQuery('SELECT Pauta.*,Timeslot.*, Student.*, Examiner.*, Exam_route.Route,Exam_type.Short,school.permit, '+
				'exam.idExam,exam.T_exam_results_idT_exam_results,exam.Car_plate,exam.Revision,exam.Complain,school.School_name '+
				'FROM Pauta '+
				'LEFT JOIN Timeslot on Pauta.Timeslot_idTimeslot=Timeslot.idTimeslot '+
			    'LEFT JOIN Booked on Booked.Timeslot_idTimeslot= Timeslot.idTimeslot '+
			    'LEFT JOIN student_license on Booked.Student_license_idStudent_license= Student_license.idStudent_license '+
			    'LEFT JOIN student on Student_license.Student_idStudent=Student.idStudent '+
			    'LEFT JOIN Examiner_qualifications on Pauta.Examiner_qualifications_idExaminer_qualifications=Examiner_qualifications.idExaminer_qualifications '+
				'LEFT JOIN Examiner on Examiner_qualifications.Examiner_idExaminer=Examiner.idExaminer '+
				'LEFT JOIN Exam_route on Pauta.Exam_route_idExam_route=Exam_route.idExam_route '+
				'LEFT JOIN Exam_type on Pauta.Exam_type_idExam_type=Exam_type.idExam_type '+
				'LEFT JOIN School on student_license.School_idSchool=School.idSchool '+
				'LEFT JOIN Exam on Exam.Booked_idBooked=Booked.idBooked '+
				'WHERE Pauta.idPauta = ?',[idpauta],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byNumPauta = (pauta_num,cb)=>{
	return myQuery('SELECT Pauta.*,Timeslot.*,Student.*,Examiner.*,Exam_route.Route,Exam_type.Short,school.permit,'+
				'exam.idExam,exam.T_exam_results_idT_exam_results,exam.Car_plate,exam.Revision,exam.Complain,school.School_name '+
				'FROM Pauta '+
				'LEFT JOIN Timeslot on Pauta.Timeslot_idTimeslot=Timeslot.idTimeslot '+
			    'LEFT JOIN Booked on Booked.Timeslot_idTimeslot= Timeslot.idTimeslot '+
			    'LEFT JOIN student_license on Booked.Student_license_idStudent_license= Student_license.idStudent_license '+
			    'LEFT JOIN student on Student_license.Student_idStudent=Student.idStudent '+
			    'LEFT JOIN Examiner_qualifications on Pauta.Examiner_qualifications_idExaminer_qualifications=Examiner_qualifications.idExaminer_qualifications '+
				'LEFT JOIN Examiner on Examiner_qualifications.Examiner_idExaminer=Examiner.idExaminer '+
				'LEFT JOIN Exam_route on Pauta.Exam_route_idExam_route=Exam_route.idExam_route '+
				'LEFT JOIN Exam_type on Pauta.Exam_type_idExam_type=Exam_type.idExam_type '+
				'LEFT JOIN School on student_license.School_idSchool=School.idSchool '+
				'LEFT JOIN Exam on Exam.Booked_idBooked=Booked.idBooked '+
				'WHERE Pauta.Pauta_num = ?',[pauta_num],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byTimeslotPauta = (idtimeslot,cb)=>{
	return myQuery('SELECT * FROM Pauta WHERE Timeslot_idTimeslot=? LIMIT 1',[idtimeslot],
					(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byPauta_num_Pauta=(pauta_num,cb)=>{
	return myQuery('SELECT * FROM Pauta WHERE Pauta.Pauta_num = ? LIMIT 1',[pauta_num],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_MAXPautaNum=(idexam_center,cb)=>{
	return myQuery('SELECT IFNULL(MAX(Pauta_num),0) as pauta_num FROM Pauta '+
					'LEFT JOIN timeslot on pauta.Timeslot_idTimeslot=Timeslot.idTimeslot '+
					'WHERE Timeslot.Exam_center_idExam_center=?',[idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// Get examiners and routes allocated to pautas on starting timeslots
var Qget_SelectionPautas=(idexam_center,date,time,cb)=>{
		return myQuery('SELECT Pauta.Pauta_num,Examiner.License_num,Examiner.Examiner_name,Exam_route.Route '+
				'FROM timeslot LEFT JOIN Pauta ON Timeslot.idTimeslot = Pauta.Timeslot_idTimeslot '+
				'LEFT JOIN Examiner_qualifications '+
					'ON Pauta.Examiner_qualifications_idExaminer_qualifications=Examiner_qualifications.idExaminer_qualifications '+
				'LEFT JOIN Examiner ON Examiner_qualifications.Examiner_idExaminer=Examiner.idExaminer '+
				'LEFT JOIN Exam_route ON Pauta.Exam_route_idExam_route=Exam_route.idExam_route '+
				'WHERE Timeslot_date= ? AND Begin_time<= ? AND Timeslot.Exam_center_idExam_center = ?',
				[date,time,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// create pauta
var Qcreate_Pauta=(values,cb)=>{
	return myQuery('INSERT INTO Pauta (Pauta_num,Timeslot_idTimeslot,Account_idAccount,Exam_type_idExam_type) values (?)',
						[values],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// delete Pauta by id
var Qdelete_byIdPauta=(id,cb)=>{
	return myQuery('DELETE FROM Pauta WHERE idPauta = ?',[id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);
	})
};

// update record in Pauta
var Qupdate_byIdPauta=(id,values,cb)=>{
	return myQuery('UPDATE Pauta SET ? where idPauta=?',[values,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

// update record in Pauta
var Qupdate_Force_Examiner=(id,reason,idqualification,cb)=>{
	return myQuery('UPDATE Pauta SET F_reason=?, Examiner_qualifications_idExaminer_qualifications=? WHERE idPauta=?',
					[reason,idqualification,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

// update record in Pauta
var Qupdate_Pauta_Examiner_qualifications=(idexaminer,pauta_num,cb)=>{
	return myQuery('UPDATE Pauta SET Examiner_qualifications_idExaminer_qualifications=? where Pauta_num=?',
				[idexaminer,pauta_num],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

// update record in Pauta
var Qupdate_Pauta_route=(idroute,pauta_num,cb)=>{
	return myQuery('UPDATE Pauta SET Exam_route_idExam_route=? where Pauta_num=?',
				[idroute,pauta_num],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

// update record in Pauta
var Qupdate_Pauta_route=(idroute,pauta_num,cb)=>{
	return myQuery('UPDATE Pauta SET Exam_route_idExam_route=? where Pauta_num=?',
				[idroute,pauta_num],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

// update record in Pauta
var Qupdate_Pauta_examiner=(idExaminer_qualifications,idtimeslot,cb)=>{
	return myQuery('UPDATE Pauta SET Examiner_qualifications_idExaminer_qualifications=? where Timeslot_idTimeslot=?',
				[idExaminer_qualifications,idtimeslot],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

// -----------------------------------ADVANCE SEARCH------------------------------------------
var Qget_search=(query,values,cb)=>{
	let customQuery='SELECT pauta.*,timeslot.*,Exam.* '+
				'FROM pauta,timeslot,Exam '+
				'WHERE pauta.Timeslot_idTimeslot = Timeslot.idTimeslot '+
		        'AND Pauta.idPauta = Exam.Pauta_idPauta '+
		        'AND ' + query;
	return myQuery(customQuery,values,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

module.exports = function(myQuery){
	return {
		Qget_AllPautas,
		Qget_byExam_Center_AllPautas,
		Qget_byId_Exam_Center_Pauta,
		Qget_byIdPauta,
		Qget_byNumPauta,
		Qget_byTimeslotPauta,
		Qget_byPauta_num_Pauta,
		Qget_MAXPautaNum,
		Qget_SelectionPautas,
		Qcreate_Pauta,
		Qdelete_byIdPauta,
		Qupdate_byIdPauta,
		Qupdate_Force_Examiner,
		Qupdate_Pauta_Examiner_qualifications,
		Qupdate_Pauta_route,
		Qupdate_Pauta_examiner,
		Qget_search
	};
};