// get examiner qualifications by id
var Qget_byIdExaminer_Examiner_qualification =(idexaminer, cb)=>{
	return myQuery('SELECT * FROM examiner_qualifications WHERE Examiner_idExaminer = ?',[idexaminer],
							(error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byIdExam_type_Examiner_qualification=(idexam_center,idexam_type,cb)=>{
	return myQuery('SELECT examiner_qualifications.idExaminer_qualifications,examiner.Examiner_name,examiner.Num '+
					'FROM examiner_qualifications,examiner '+
					'WHERE examiner_qualifications.Examiner_idExaminer = examiner.idExaminer '+
					'AND examiner.Exam_center_idExam_center = ? '+
        			'AND examiner_qualifications.Exam_type_idExam_type = ? '+
        			'AND examiner_qualifications.Active = 1',
					[idexam_center,idexam_type],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

var Qget_ForceAvailable=(idexam_center,idexam_type,day,time,cb)=>{
		return myQuery('SELECT t2.quali, Examiner.Examiner_name,Examiner.License_num from (SELECT  t1.quali, count(*) as count '+ 
				'FROM (SELECT Examiner_qualifications.idExaminer_qualifications AS quali '+
					'FROM Examiner_qualifications,Examiner '+
					'WHERE Examiner_qualifications.Examiner_idExaminer=Examiner.idExaminer '+
					'AND Examiner.Exam_center_idExam_center = ? ' +
					'AND Examiner_qualifications.active = 1 '+
        			'AND Examiner_qualifications.Exam_type_idExam_type = ? '+
 					'UNION ALL SELECT '+
    					'pauta.Examiner_qualifications_idExaminer_qualifications AS quali '+
						'FROM Pauta,Timeslot '+
						'WHERE Pauta.Timeslot_idTimeslot = Timeslot.idTimeslot '+
						'AND Timeslot.Exam_center_idExam_center = ? '+
        				'AND Timeslot.Timeslot_date = ? '+
        				'AND Timeslot.Begin_time < ? '+
        				'AND Timeslot.End_time > ? '+
        				'AND pauta.Examiner_qualifications_idExaminer_qualifications is not null) as t1 '+
        			'GROUP BY t1.quali '+
					'HAVING COUNT(*) = 1) as t2, Examiner_qualifications,Examiner '+ 
       		 	'WHERE t2.quali=Examiner_qualifications.idExaminer_qualifications '+
        		'AND Examiner_qualifications.Examiner_idExaminer=Examiner.idExaminer',
               	[idexam_center,idexam_type,idexam_center,day,time,time],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

// get examiner qualifications by id
var Qget_IdExaminer_qualification =(idexaminer,idexam_type, cb)=>{
	return myQuery('SELECT idExaminer_qualifications FROM examiner_qualifications WHERE Examiner_idExaminer = ? AND Exam_type_idExam_type=?',
							[idexaminer,idexam_type],(error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_Active_Examiner_qualification=(idexam_center,cb)=>{
	return myQuery('SELECT examiner_qualifications.* FROM examiner_qualifications, Examiner '+
					'WHERE examiner_qualifications.Examiner_idExaminer = Examiner.idExaminer '+
					'AND Examiner.Exam_center_idExam_center =? AND Examiner.active=1 ',
					[idexam_center],(error, results, fields) => {
		error ? cb(error) : cb(false,results);
	});
};

var Qget_AvailableExaminer_Qualification = (idexam_center,date,time,cb) => {
  return myQuery(
    "SELECT examiner_qualifications.*,timeslot.idtimeslot FROM examiner_qualifications, Examiner,exam_type,timeslot " +
      "WHERE examiner_qualifications.Examiner_idExaminer = Examiner.idExaminer " +
      "AND examiner_qualifications.Exam_type_idExam_type=Exam_type.idExam_type " +
      "AND Exam_type.idExam_type=timeslot.Exam_type_idExam_type " +
      "AND Examiner.Exam_center_idExam_center = ? AND Examiner.active=1 " +
      "AND Timeslot_date=? AND Begin_time<=? ORDER BY idtimeslot ASC",
    [idexam_center, date, time],(error, results, fields) => {
      error ? cb(error) : cb(false, results);
    }
  );
};

// put record in school given exam_center id
var Qcreate_Examiner_qualification=(values,cb)=>{
	return myQuery('INSERT INTO examiner_qualifications (Note,Exam_type_idExam_type,Examiner_idExaminer) '+
							'values (?)',[values],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// delete record by id in Examiner
var Qdelete_byIdExaminer_qualification=(id,cb)=>{
	return myQuery('DELETE FROM examiner_qualifications WHERE idExaminer_qualifications = ?',[id],
							(error, results,fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// update record in school
var Qupdate_byIdExaminer_qualification=(id,values,cb)=>{
	return myQuery('UPDATE examiner_qualifications SET ? where idExaminer_qualifications=?',[values,id],
							(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

module.exports = function(myQuery){
	return {
		Qget_byIdExaminer_Examiner_qualification,
		Qget_byIdExam_type_Examiner_qualification,
		Qget_IdExaminer_qualification,
		Qget_Active_Examiner_qualification,
		Qget_AvailableExaminer_Qualification,
		Qget_ForceAvailable,
		Qcreate_Examiner_qualification,
		Qdelete_byIdExaminer_qualification,
		Qupdate_byIdExaminer_qualification
	};
};