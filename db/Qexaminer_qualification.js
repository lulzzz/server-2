// get examiner qualifications by id
var Qget_byIdExaminer_Examiner_qualification =(idexaminer, cb)=>{
	return myQuery('SELECT * FROM examiner_qualifications WHERE Examiner_idExaminer = ?',[idexaminer],
							(error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byIdExam_type_Examiner_qualification=(idexam_type,cb)=>{
	return myQuery('SELECT examiner_qualifications.idExaminer_qualifications,examiner.Examiner_name,examiner.Num '+
					'FROM examiner_qualifications,examiner '+
					'WHERE examiner_qualifications.Examiner_idExaminer = examiner.idExaminer '+
        			'AND examiner_qualifications.Exam_type_idExam_type = ?',
					[idexam_type],(error, results, fields)=>{
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

var Qget_AvailableExaminer_Qualification=(idexam_center,date,time,cb)=>{
	return myQuery('SELECT examiner_qualifications.*,timeslot.idtimeslot FROM examiner_qualifications, Examiner,exam_type,timeslot '+
					'WHERE examiner_qualifications.Examiner_idExaminer = Examiner.idExaminer '+
                    'AND examiner_qualifications.Exam_type_idExam_type=Exam_type.idExam_type '+
                    'AND Exam_type.idExam_type=timeslot.Exam_type_idExam_type '+
					'AND Examiner.Exam_center_idExam_center = ? AND Examiner.active=1 '+
                    'AND Timeslot_date=? AND Begin_time<=? ORDER BY Exam_type_idExam_type ASC',
					[idexam_center,date,time],(error, results, fields) => {
		error ? cb(error) : cb(false,results);
	});
};


// SELECT examiner_qualifications.*,timeslot.idtimeslot, count(idtimeslot) as 'numero' FROM examiner_qualifications, Examiner,exam_type,timeslot,pauta
// 					WHERE examiner_qualifications.Examiner_idExaminer = Examiner.idExaminer 
//                     AND examiner_qualifications.Exam_type_idExam_type=Exam_type.idExam_type 
//                     AND Exam_type.idExam_type=timeslot.Exam_type_idExam_type
//                     AND Pauta.Timeslot_idTimeslot = Timeslot.idTimeslot
//                     AND Pauta.Examiner_qualifications_idExaminer_qualifications IS NULL 
// 					AND Examiner.Exam_center_idExam_center = 4 AND Examiner.active=1 
//                     AND timeslot.Timeslot_date='2019-09-04' AND timeslot.Begin_time<='10:45:00'  
//                     group by idtimeslot 
//                     ORDER BY numero ASC

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
		Qcreate_Examiner_qualification,
		Qdelete_byIdExaminer_qualification,
		Qupdate_byIdExaminer_qualification
	};
};