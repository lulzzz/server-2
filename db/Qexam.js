// get all records in exams
var Qget_AllExams = (cb)=>{
	return myQuery('SELECT * FROM Exam',null,(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all records in exams given exam_center
var Qget_AllExams_Exam_Center = (idexam_center,cb)=>{
	return myQuery('SELECT Exam.*,booked.*,Pauta.*,student_license.*,student.*,school.* '+
				'FROM Exam LEFT JOIN Booked ON Exam.Booked_idBooked = Booked.idBooked '+
        		'LEFT JOIN Pauta ON Exam.Pauta_idPauta = Pauta.idPauta '+
        		'LEFT JOIN student_license ON Booked.Student_license_idStudent_license = Student_license.idStudent_license '+
       	 		'LEFT JOIN student ON Student_license.Student_idStudent = Student.idStudent '+
        		'LEFT JOIN School ON Student_license.School_idSchool = School.idSchool '+
				'WHERE Booked.Exam_center_idExam_center = ?',[idexam_center], (error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in exams
var Qget_byIdExam_Exam_Center =(id,idexam_center, cb)=>{
	return myQuery('SELECT Exam.*,booked.*,Pauta.*,student_license.*,student.*,school.* '+
					'FROM Exam LEFT JOIN Booked ON Exam.Booked_idBooked = Booked.idBooked '+
	        		'LEFT JOIN Pauta ON Exam.Pauta_idPauta = Pauta.idPauta '+
	        		'LEFT JOIN student_license ON Booked.Student_license_idStudent_license = Student_license.idStudent_license '+
	       	 		'LEFT JOIN student ON Student_license.Student_idStudent = Student.idStudent '+
	        		'LEFT JOIN School ON Student_license.School_idSchool = School.idSchool '+
					'WHERE Exam.idExam = ? AND Booked.Exam_center_idExam_center = ?',
					[id,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by exam date in exams
var Qget_byExamDateExam_Exam_Center =(exam_date,idexam_center, cb)=>{
	return myQuery('SELECT Exam.* FROM Exam,Booked WHERE exam.Exam_date = ? AND Exam.Booked_idBooked=Booked.idBooked '+ 
					'AND Booked.Exam_center_idExam_center = ?',[exam_date,idexam_center],
					(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by Associate_num in exams
var Qget_byExamNumExam_Exam_Center =(exam_num,idexam_center, cb)=>{
	return myQuery('SELECT Exam.* FROM Exam,Booked WHERE exam.Exam_num = ? AND Exam.Booked_idBooked=Booked.idBooked '+
					'AND Booked.Exam_center_idExam_center = ?',[exam_num,idexam_center], (error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get exams without number
var Qget_not_numbered_exams = (idexam_center,cb)=>{
	return myQuery('SELECT exam.* FROM exam '+
			'LEFT JOIN booked ON exam.Booked_idBooked=Booked.idBooked '+
			'WHERE exam.Exam_num IS NULL AND Booked.Exam_center_idExam_center=?',[idexam_center], (error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get max exam number
var Qget_MAXExamNum=(idexam_center,cb)=>{
	return myQuery('SELECT IFNULL(MAX(Exam_num),1) AS Exam_num FROM Exam '+
					'LEFT JOIN booked ON exam.Booked_idBooked=Booked.idBooked '+
					'WHERE Booked.Exam_center_idExam_center=? Limit 1',[idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

// put record in exams given exam_center id
var Qcreate_Exam=(values,cb)=>{
	//console.log(values);
	return myQuery('INSERT INTO Exam (Booked_idBooked,Account_idAccount,Pauta_idPauta) '+
							'values (?)',[values],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// delete record by id in exams
var Qdelete_byIdExam=(id,cb)=>{
	return myQuery('DELETE FROM Exam WHERE idExam = ?',[id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);
	})
};

// update record in exams
var Qupdate_byIdExam=(id,values,cb)=>{
	return myQuery('UPDATE Exam SET ? where idExam=?',[values,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

// insert number on given idexam
var Qupdate_ExamNumber=(id,exam_num,cb)=>{
	return myQuery('UPDATE Exam SET Exam_num=? where idExam=?',[exam_num,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

// update record in bookings for exam number
var Qupdate_Exam_SiccStatus=(id,operation,cb)=>{
	return myQuery("UPDATE exam SET sicc_status_idsicc_status = "+
						"(SELECT idsicc_status FROM t_sicc_status WHERE process = 3 AND operation = ?) "+
                        "WHERE idExam = ?",[operation,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// -----------------------------------ADVANCE SEARCH------------------------------------------
var Qget_search=(query,values,cb)=>{
	let customQuery='SELECT Exam.*,Booked.*,Student_license.*,School.*,Student.*,Timeslot.*,Pauta.* '+
				'FROM Booked,Exam_type,timeslot,student_license,school,student,Pendent_payments,Pauta '+
				'WHERE Booked.Timeslot_idTimeslot = Timeslot.idTimeslot '+
		        'AND Booked.Student_license_idStudent_license=Student_license.idStudent_license '+
				'AND Student_license.School_idSchool=School.idSchool '+
				'AND Student_license.Student_idStudent=Student.idStudent '+
				'AND Booked.idBooked=Pendent_payments.Booked_idBooked '+
				'AND Timeslot.idTimeslot=Pauta.Timeslot_idTimeslot '+
		        'AND ' + query;
	return myQuery(customQuery,values,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

module.exports = function(myQuery){
	return {
		Qget_AllExams,
		Qget_AllExams_Exam_Center,
		Qget_byIdExam_Exam_Center,
		Qget_byExamDateExam_Exam_Center,
		Qget_byExamNumExam_Exam_Center,
		Qget_not_numbered_exams,
		Qget_MAXExamNum,
		Qcreate_Exam,
		Qdelete_byIdExam,
		Qupdate_byIdExam,
		Qupdate_ExamNumber,
		Qupdate_Exam_SiccStatus,
		Qget_search
	}
}