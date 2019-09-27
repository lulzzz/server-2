// get all records in exam_center
var Qget_AllExam_center = (cb)=>{
	// console.log("2. We are on getAll");
	return myQuery('SELECT exam_center.* FROM exam_center', null ,(error, results, fields) =>{
		// console.log("5. We are again on getAll");
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in exam_center
var Qget_byIdExam_center =(id, cb)=>{
	// console.log("2. We are on getById trying to filter by id: " + id);
	return myQuery('SELECT exam_center.* FROM exam_center WHERE idexam_center = ?',[id],
									 (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in exam_center
var Qget_IdbyNameExam_center =(name, cb)=>{
	return myQuery('SELECT idExam_center FROM exam_center WHERE Exam_center_name LIKE ?',["%"+name+"%"],
									function (error, results, fields) {
		error ? cb(error) : cb(false,results);
	});
};

// get record by name in exam_center
var Qget_byNameExam_center =(name, cb)=>{
	return myQuery('SELECT exam_center.* FROM exam_center WHERE Exam_center_name LIKE ?',
							["%"+name+"%"],(error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by center number in exam_center
var Qget_byCenter_numExam_center =(center_num, cb)=>{
	return myQuery('SELECT exam_center.* FROM exam_center WHERE Center_num LIKE ?',
						["%"+center_num+"%"], (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

var Qget_imttCredencials=(idexam_center,cb)=>{
		return myQuery('SELECT exam_center.Center_num,exam_center.Center_code FROM exam_center WHERE idExam_center = ? LIMIT 1',
						[idexam_center], (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

var Qget_smtpCredencials = (idexam_center, cb) => {
	return myQuery('SELECT exam_center.SMTP_server,exam_center.SMTP_user, exam_center.SMTP_pass FROM exam_center WHERE idExam_center = ? LIMIT 1',
		[idexam_center], (error, results, fields) => {
			error ? cb(error) : cb(false, results);
		});
};

// put record in exam_center
var Qcreate_Exam_center=(values,cb)=>{
	return myQuery(`INSERT INTO exam_center (Exam_center_num,Exam_center_name,Address,Center_num,Center_code,`+
							`Tax_num,Zip_code,Location,Telephone1,Telephone2,Email1,Email2) values (?)`,
							[values],function (error, results, fields) {
		error ? cb(error) : cb(false,results);	
	});
};

// delete record by id in exam_center
var Qdelete_byIdExam_center=(id,cb)=>{
	return myQuery('DELETE FROM exam_center WHERE idExam_center = ?',[id],function(error, results,fields){
		error ? cb(error) : cb(false,results);
	})
};

// update record in exam_center
var Qupdate_byIdExam_center=(id,values,cb)=>{
	return myQuery('UPDATE exam_center SET ? where idexam_center=?',[values,id],function(error, results,fields){
		error ? cb(error) : cb(false,results);	
	})
}

module.exports = function(myQuery){
	return {
		Qget_AllExam_center,
		Qget_byIdExam_center,
		Qget_byNameExam_center,
		Qget_byCenter_numExam_center,
		Qget_IdbyNameExam_center,
		Qget_imttCredencials,
		Qget_smtpCredencials,
		Qcreate_Exam_center,
		Qdelete_byIdExam_center,
		Qupdate_byIdExam_center
	};
};