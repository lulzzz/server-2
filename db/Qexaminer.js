// get all records in examiners
var Qget_AllExaminer = (cb)=>{
	return myQuery('SELECT idExaminer, Examiner_name, Num, License_num, License_expiration,'+ 
									'Obs FROM Examiner',null,  (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get examiner by id
var Qget_byIdExaminer =(id, cb)=>{
	return myQuery('SELECT idExaminer, Examiner_name, Num, License_num, License_expiration,'+ 
									'Obs FROM Examiner WHERE idExaminer = ?',[id], (error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

// get all examiners in a given exam center 
var Qget_AllExaminer_Exam_Center =(idexam_center,cb)=>{
	return myQuery('SELECT Examiner.* FROM Examiner, Exam_Center ' +
				'WHERE Examiner.Exam_center_idExam_center=exam_center.idexam_center '+
				'AND exam_center.idexam_center=?',
				[idexam_center],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get active examiners in a given exam center 
var Qget_ActiveExaminer_Exam_Center =(idexam_center,cb)=>{
	return myQuery('SELECT Examiner.* FROM Examiner, Exam_Center ' +
				'WHERE Examiner.Exam_center_idExam_center=exam_center.idexam_center '+
				'AND Examiner.Active = 1 AND exam_center.idexam_center=?',
				[idexam_center],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get examiner by id
var Qget_byIdExaminer_Exam_Center =(id,idexam_center, cb)=>{
	return myQuery('SELECT Examiner.idExaminer, Examiner.Examiner_name, Examiner.Num, Examiner.License_num, '+
				'Examiner.License_expiration,Examiner.Obs '+ 
				'FROM Examiner WHERE idExaminer = ? AND exam_center.idexam_center=?',
				[id,idexam_center], (error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

// get examiner by name given exam center
var Qget_byNameExaminer_Exam_Center =(name,idexam_center,cb)=>{
	return myQuery('SELECT Examiner.idExaminer, Examiner.Examiner_name, Examiner.Num, Examiner.License_num, '+ 
									'Examiner.License_expiration, Examiner.Obs '+ 
									'FROM Examiner, Exam_Center ' +
									'WHERE Examiner.Exam_center_idExam_center=exam_center.idexam_center '+
									'AND Examiner.Examiner_name LIKE ? AND exam_center.idexam_center=?',
									["%"+name+"%", idexam_center],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get examiner by qualification id
var Qget_byIdQualification_Examiner=(idqualification,cb)=>{
	return myQuery('SELECT Examiner.Examiner_name, Examiner.Num FROM Examiner, examiner_qualifications ' +
									'WHERE Examiner.idExaminer=examiner_qualifications.Examiner_idExaminer AND '+
									'examiner_qualifications.idExaminer_qualifications = ?',[idqualification],
									(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});	
};

// get examiner by license number given exam center
var Qget_byLicenseExaminer_Exam_Center =(license_num,idexam_center,cb)=>{
	return myQuery('SELECT Examiner.idExaminer, Examiner.Examiner_name, Examiner.Num, Examiner.License_num, '+
									'Examiner.License_expiration, Examiner.Obs '+ 
									'FROM Examiner, Exam_Center '+
									'WHERE Examiner.Exam_center_idExam_center=exam_center.idexam_center '+
									'Examiner.License_num = ? AND exam_center.idexam_center=?',
									[license_num, idexam_center], (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// put record in school given exam_center id
var Qcreate_Examiner=(values,cb)=>{
	return myQuery(`INSERT INTO Examiner (Examiner_name,Num,License_num,License_expiration,Active,` +
							`Obs,Exam_center_idExam_center) values (?)`,[values],
							(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// delete record by id in Examiner
var Qdelete_byIdExaminer=(id,cb)=>{
	return myQuery('DELETE FROM Examiner WHERE idExaminer = ?',[id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);
	})
};

// update record in examiner
var Qupdate_byIdExaminer=(id,values,cb)=>{
	return myQuery('UPDATE Examiner SET ? where idExaminer=?',[values,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

// -----------------------------------ADVANCE SEARCH------------------------------------------
var Qget_search=(query,values,cb)=>{
	let customQuery='SELECT Examiner.*,Examiner_qualifications.*,exam_type.Exam_type_name '+
				'FROM Examiner '+
				'LEFT JOIN Examiner_qualifications ON Examiner_qualifications.Examiner_idExaminer = Examiner.idExaminer '+
				'LEFT JOIN Pauta ON Examiner_qualifications.idExaminer_qualifications = Pauta.Examiner_qualifications_idExaminer_qualifications '+
				'LEFT JOIN Timeslot ON Pauta.Timeslot_idTimeslot=Timeslot.idTimeslot '+
				'LEFT JOIN Exam_type ON Pauta.Exam_type_idExam_type=Exam_type.idExam_type '+
				'WHERE ' + query;
	return myQuery(customQuery,values,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

module.exports = (myQuery)=>{
	return {
		Qget_AllExaminer,
		Qget_byIdExaminer,
		Qget_AllExaminer_Exam_Center,
		Qget_ActiveExaminer_Exam_Center,
		Qget_byIdExaminer_Exam_Center,
		Qget_byNameExaminer_Exam_Center,
		Qget_byLicenseExaminer_Exam_Center,
		Qget_byIdQualification_Examiner,
		Qcreate_Examiner,
		Qdelete_byIdExaminer,
		Qupdate_byIdExaminer,
		Qget_search
	};
};