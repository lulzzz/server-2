// Query PEP rows
const Qget_search_PEP = (query, values, cb) => {
    let customQuery = 'SELECT'
        + ' booked.idBooked,'
        + ' exam_center.Center_num AS examCenterCode,'
        + ' school.Permit AS schoolLicense,'
        + ' t_id_type.IMT_type AS docIdType,'
        + ' student.ID_num AS docIdNumber,'
        + ' student.Student_name AS name,'
        + ' student_license.Student_license AS learningLicenseNumber,'
        + ' exam_type.code AS examCode,'
        + ' timeslot.Timeslot_date AS examDate,'
        + ' timeslot.Begin_time AS examTime'
        + ' FROM timeslot'
        + '	INNER JOIN exam_center ON timeslot.Exam_center_idExam_center = exam_center.idExam_center'
        + '	INNER JOIN booked ON timeslot.idTimeslot = booked.Timeslot_idTimeslot'
        + '	INNER JOIN student_license ON booked.Student_license_idStudent_license = student_license.idStudent_license'
        + '	INNER JOIN school ON student_license.School_idSchool = school.idSchool'
        + '	INNER JOIN student ON student_license.Student_idStudent = student.idStudent'
        + ' INNER JOIN t_id_type ON student.T_ID_type_idT_ID_type = t_id_type.idT_ID_type'
        + ' INNER JOIN exam_type ON booked.Exam_type_idExam_type = exam_type.idExam_type'
        + ' LEFT JOIN pauta ON timeslot.idTimeslot = pauta.Timeslot_idTimeslot'
        + ' WHERE ' + query

    return myQuery(customQuery, values, (error, results, fields) => {
        error ? cb(error) : cb(false, results);
    });
};

// Query REP rows
const Qget_search_REP = (query, values, cb) => {
    let customQuery = 'SELECT'
        + ' exam.idExam,'
        + ' exam_center.Center_num AS examCenterCode,'
        + ' timeslot.Timeslot_date AS examDate,'
        + ' school.Permit AS schoolLicense,'
        + ' t_id_type.IMT_type AS docIdType,'
        + ' student.ID_num AS docIdNumber,'
        + ' student.Student_name AS name,'
        + ' student_license.Student_license AS learningLicenseNumber,'
        + ' timeslot.Begin_time AS examTime,'
        + ' exam_type.Code AS examCode,'
        + ' examiner.License_num AS examinerCode,'
        + ' exam_route.Code AS circuitCode,'
        + ' t_exam_results.Code AS examResultCode'
        + ' FROM timeslot'
        + ' INNER JOIN exam_center ON timeslot.Exam_center_idExam_center = exam_center.idExam_center'
        + ' INNER JOIN pauta ON timeslot.idTimeslot = pauta.Timeslot_idTimeslot'
        + ' INNER JOIN exam_type ON pauta.Exam_type_idExam_type = exam_type.idExam_type'
        + ' INNER JOIN examiner_qualifications ON pauta.Examiner_qualifications_idExaminer_qualifications = examiner_qualifications.idExaminer_qualifications'
        + ' INNER JOIN examiner ON examiner_qualifications.idExaminer_qualifications = examiner.idExaminer'
        + ' INNER JOIN exam_route ON pauta.Exam_route_idExam_route = exam_route.idExam_route'
        + ' INNER JOIN exam ON pauta.idPauta = exam.Pauta_idPauta'
        + ' INNER JOIN t_exam_results ON exam.T_exam_results_idT_exam_results = t_exam_results.idT_exam_results'
        + ' INNER JOIN booked ON exam.Booked_idBooked = booked.idBooked'
        + ' INNER JOIN student_license ON booked.Student_license_idStudent_license = student_license.idStudent_license'
        + ' INNER JOIN student ON student_license.Student_idStudent = student.idStudent'
        + ' INNER JOIN school ON student_license.School_idSchool = school.idSchool'
        + ' INNER JOIN t_id_type ON student.T_ID_type_idT_ID_type = t_id_type.idT_ID_type'
        + ' WHERE ' + query

    return myQuery(customQuery, values, (error, results, fields) => {
        error ? cb(error) : cb(false, results);
    });

};

// Query ETC rows
const Qget_search_ETC = (query, values, cb) => {
    let customQuery = 'SELECT'
        + ' student_license.idStudent_license,'
        + ' exam_center.Center_num AS examCenterCode,'
        + ' t_id_type.IMT_type AS docIdType,'
        + ' student.ID_num AS docIdNumber,'
        + ' student_license.Student_license AS learningLicenseNumber,'
        + ' student.Tax_num as NIF    '
        + ' FROM anieca.exam '
        + ' INNER JOIN booked'
        + ' ON exam.Booked_idBooked = booked.idBooked'
        + ' INNER JOIN exam_center ON booked.Exam_center_idExam_center = exam_center.idExam_center'
        + ' INNER JOIN student_license ON booked.Student_license_idStudent_license = student_license.idStudent_license'
        + ' INNER JOIN student ON student_license.Student_idStudent = student.idStudent'
        + ' INNER JOIN t_id_type ON student.T_ID_type_idT_ID_type = t_id_type.idT_ID_type'
        + ' INNER JOIN timeslot	ON booked.Timeslot_idTimeslot = timeslot.idTimeslot'
        + ' WHERE T_exam_results_idT_exam_results = 1'
        + ' AND ' + query

    return myQuery(customQuery, values, (error, results, fields) => {
        error ? cb(error) : cb(false, results);
    });
};

var Qget_byLicenseBooked=(idlicense,cb)=>{
	return myQuery("SELECT idBooked FROM anieca.booked " +
                    "inner join student_license on booked.Student_license_idStudent_license = student_license.idStudent_license "+
                    "where student_license.Student_license = ?",[idlicense],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

var Qget_sicc_info=(fileType,cb)=>{
	let file_num=fileType+"_num";
	let file_year=fileType+"_year";
	return myQuery('SELECT ? as num, ? as year, exam_center.Center_num as center FROM sicc_info '+
        		'INNER JOIN exam_center on sicc_info.Exam_center_idExam_center = exam_center.idExam_center',
        		[file_num,file_year],(error, results,fields)=>{
      	error ? cb(error) : cb(false,results);	
	});
};

var Qpost_SiccErrBooked=(code, msg, id,cb)=>{
	return myQuery("INSERT INTO sicc_error (error_code, error_msg, Booked_idBooked) VALUES (?, ?, ?)",[code,msg,id],
				(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});	
};

var Qpost_SiccErrExam=(code, msg, id,cb)=>{
	return myQuery("INSERT INTO sicc_error (error_code, error_msg, Exam_idExam) VALUES (?, ?, ?)",[code,msg,id],
				(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});	
};

var Qpost_SiccErrLicense=(code, msg, id,cb)=>{
	return myQuery("INSERT INTO sicc_error (error_code, error_msg, Student_license_idStudent_license) VALUES (?, ?, ?)",[code,msg,id],
				(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});	
};

var Qupdate_sicc_info=(values,cb)=>{
	return myQuery("UPDATE sicc_info SET ?",[values],(error, results,fields)=>{
      	error ? cb(error) : cb(false,results);	
	});
}

module.exports = function(myQuery){
	return {
		Qget_search_PEP,
		Qget_search_REP,
		Qget_search_ETC,
		Qget_byLicenseBooked,
		Qget_sicc_info,
		Qpost_SiccErrBooked,
		Qpost_SiccErrExam,
		Qpost_SiccErrLicense,
		Qupdate_sicc_info
	};
};