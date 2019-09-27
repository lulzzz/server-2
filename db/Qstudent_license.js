// get all records in student
var Qget_AllStudent_license = (cb)=>{
	return myQuery('SELECT * FROM Student, Student_license '+
							'WHERE Student.idStudent=Student_license.Student_idStudent',
							null,  (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in student
var Qget_byLicenseStudent =(student_license,idexam_center, cb)=>{
	return myQuery('SELECT * FROM Student, Student_license, School,Exam_center '+
							'WHERE Student.idStudent=Student_license.Student_idStudent '+
							'AND Student_license.School_idSchool=School.idSchool '+
							'AND School.Exam_center_idExam_center=Exam_center.idExam_center ' + 
							'AND Student_license.Student_license = ? AND Exam_center.idExam_center=?',
							[student_license,idexam_center],(error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in student
var Qget_Student_license =(student_license, cb)=>{
	return myQuery('SELECT idStudent_license FROM anieca.student_license '+
                        'where student_license.Student_license = ?',
						[student_license],(error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};


// put record in school given exam_center id
var Qcreate_Student_license=(values,id_student,id_school,id_category,cb)=>{
	return myQuery(`INSERT INTO Student_license (Student_license,Expiration_date,Active,` +
							`Student_idStudent,School_idSchool,Type_category_idType_category) `+
							`values (?,?,?,?)`,[values,id_student,id_school,id_category],
							(error, results, fields)=> {
		error ? cb(error) : cb(false,results);	
	});
};

var Qupdate_Student_license=(values,id,cb)=>{
	return myQuery(`UPDATE Student_license SET ? where idStudent_license=?`,[values,id],
							(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// update record in bookings for exam number
var Qupdate_License_SiccStatus=(id,operation,cb)=>{
	return myQuery("UPDATE student_license SET T_sicc_status_idsicc_status = "+
						"(SELECT idsicc_status FROM t_sicc_status WHERE process = 2 AND operation = ?) "+
                        "WHERE idStudent_license = ?",[operation,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};


module.exports = function(myQuery){
	return {
		Qget_AllStudent_license,
		Qget_byLicenseStudent,
		Qget_Student_license,
		Qcreate_Student_license,
		Qupdate_Student_license,
		Qupdate_License_SiccStatus
	};
};




// // put record in school given exam_center id
// var Qcreate_Student_license2=(connection,values,id_student,id_school,id_category,cb)=>{

// 	return myQuery2(connection,`INSERT INTO Student_license (Student_license,Expiration_date,Active,` +
// 							`Student_idStudent,School_idSchool,Type_category_idType_category) `+
// 							`values (?,?,?,?)`,[values,id_student,id_school,id_category],
// 							(error, results, fields)=> {
// 		error ? cb(error) : cb(false,results);	
// 	});
// };
