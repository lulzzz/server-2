// get all records in student (superuser)
var Qget_AllStudent = (cb)=>{
	return myQuery('SELECT Student.*,Student_license.*,t_id_type.ID_name, type_category.Category,'+
							'School.School_name, School.permit '+ 
							'FROM Student, Student_license, School, t_id_type, type_category, Exam_center ' +
							'WHERE Student.idStudent=Student_license.Student_idStudent '+
							'AND Student_license.School_idSchool=School.idSchool '+
							'AND type_category.idType_category=Student_license.Type_category_idType_category '+
							'AND t_id_type.idT_ID_type=student.T_ID_type_idT_ID_type '+
							'AND School.Exam_center_idExam_center=Exam_center.idExam_center ' +
							'ORDER BY Student.Student_name ASC',null,(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all records in student
var Qget_AllStudent_Exam_Center = (idexam_center,cb)=>{
	return myQuery('SELECT Student.*,Student_license.*,t_id_type.ID_name, type_category.Category,'+
							'School.School_name, School.permit '+
							'FROM Student,Student_license,School,t_id_type,type_category,Exam_center ' +
							'WHERE Student.idStudent=Student_license.Student_idStudent '+
							'AND Student_license.School_idSchool=School.idSchool '+
							'AND type_category.idType_category=Student_license.Type_category_idType_category '+
							'AND t_id_type.idT_ID_type=student.T_ID_type_idT_ID_type '+
							'AND School.Exam_center_idExam_center=Exam_center.idExam_center ' + 
							'AND Exam_center.idExam_center=? ORDER BY Student.Student_name ASC',
							[idexam_center],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in student (superuser)
var Qget_byIdStudent =(id, cb)=>{
	return myQuery('SELECT Student.*,Student_license.*, t_id_type.ID_name, type_category.Category,'+
							'School.School_name, School.permit '+
							'FROM Student, Student_license, School,t_id_type,type_category,Exam_center '+
							'WHERE Student.idStudent=Student_license.Student_idStudent '+
							'AND Student_license.School_idSchool=School.idSchool '+
							'AND type_category.idType_category=Student_license.Type_category_idType_category '+
							'AND t_id_type.idT_ID_type=student.T_ID_type_idT_ID_type '+
							'AND Student.idStudent = ?',[id], (error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byIdStudent_Exam_Center =(id,idexam_center, cb)=>{
	return myQuery('SELECT Student.*,Student_license.*,	t_id_type.ID_name, type_category.Category,'+
							'School.School_name, School.permit '+
							'FROM Student, Student_license, School, type_category, t_id_type, Exam_center '+
							'WHERE Student.idStudent=Student_license.Student_idStudent '+
							'AND Student_license.School_idSchool=School.idSchool '+
							'AND type_category.idType_category=Student_license.Type_category_idType_category '+
							'AND t_id_type.idT_ID_type=student.T_ID_type_idT_ID_type '+
							'AND School.Exam_center_idExam_center=Exam_center.idExam_center ' +
							'AND Student.idStudent = ? AND Exam_center.idExam_center=?',
							[id,idexam_center],(error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by name in student
var Qget_byNameStudent =(name,idexam_center, cb)=>{
	return myQuery('SELECT Student.*,Student_license.*,t_id_type.ID_name, type_category.Category,'+
							'School.School_name, School.permit '+
							'FROM Student, Student_license, School,t_id_type,type_category, Exam_center '+
							'WHERE Student.idStudent=Student_license.Student_idStudent '+
							'AND Student_license.School_idSchool=School.idSchool '+
							'AND Student.T_ID_type_idT_ID_type=t_id_type.idt_id_type '+
							'AND Student_license.Type_category_idType_category=type_category.idType_category '+
							'AND School.Exam_center_idExam_center=Exam_center.idExam_center ' +
							'AND Student.Student_name LIKE ? AND Exam_center.idExam_center=?',
							["%"+name+"%",idexam_center],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get record by identification number in student
var Qget_byIDcardStudent =(idcard,idexam_center, cb)=>{
	return myQuery('SELECT Student.*,Student_license.*,t_id_type.ID_name, type_category.Category,'+
							'School.School_name, School.permit '+
							'FROM Student, Student_license, School,t_id_type,type_category, Exam_center '+
							'WHERE Student.idStudent=Student_license.Student_idStudent '+
							'AND Student_license.School_idSchool=School.idSchool '+
							'AND Student.T_ID_type_idT_ID_type=t_id_type.idt_id_type '+
							'AND Student_license.Type_category_idType_category=type_category.idType_category '+
							'AND School.Exam_center_idExam_center=Exam_center.idExam_center ' +
							'AND Student.ID_num = ? AND Exam_center.idExam_center=?',
							[idcard,idexam_center],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get record by identification number in student
var Qget_byTaxStudent =(tax_num,idexam_center, cb)=>{
	return myQuery('SELECT Student.*,Student_license.*,t_id_type.ID_name, type_category.Category,'+
							'School.School_name, School.permit '+
							'FROM Student, Student_license,School,t_id_type,type_category,Exam_center '+
							'WHERE Student.idStudent=Student_license.Student_idStudent '+
							'AND Student_license.School_idSchool=School.idSchool '+
							'AND Student.T_ID_type_idT_ID_type=t_id_type.idt_id_type '+
							'AND Student_license.Type_category_idType_category=type_category.idType_category '+
							'AND School.Exam_center_idExam_center=Exam_center.idExam_center ' +
							'AND Student.Tax_num = ? AND Exam_center.idExam_center=?',
							[tax_num,idexam_center],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get name and nif from given pendent payment
var Qget_byPayment_StudentNif=(idpayment,cb)=>{
	return myQuery('SELECT Student.Student_name,Student.Tax_num '+
							'FROM Student, Student_license,Pendent_payments '+
							'WHERE Pendent_payments.Student_license_idStudent_license=Student_license.idStudent_license '+
							'AND Student_license.Student_idStudent=Student.idStudent '+
							'AND Pendent_payments.Payments_idPayments=?',
							[idpayment],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// create record for student 
var Qcreate_Student = (id_type_card,values,cb)=>{
	return myQuery ('INSERT INTO Student (Student_name,Student_num,Birth_date,ID_num,ID_expire_date,' + 
							'Tax_num,Drive_license_num,Obs,T_ID_type_idT_ID_type) ' +
							'values (?,?)',[values,id_type_card],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);			
	});
};

// delete record by id in student
var Qdelete_byIdStudent=(id,cb)=>{
	return myQuery('DELETE FROM Student WHERE idStudent = ?',[id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// update record in student
var Qupdate_byIdStudent=(id,values,cb)=>{
	return myQuery('UPDATE Student SET ? where idStudent=?',[values,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// -----------------------------------ADVANCE SEARCH------------------------------------------
var Qget_search=(query,values,cb)=>{
	let customQuery='SELECT student.*,student_license.*,school.* '+
				'FROM student,student_license,school '+
				'WHERE student.idStudent = student_license.Student_idStudent '+
		        'AND student_license.School_idSchool = School.idSchool '+
		        'AND ' + query;
	return myQuery(customQuery,values,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

module.exports = function(myQuery){
	return {
		Qget_AllStudent,
		Qget_byIdStudent,
		Qget_byIdStudent_Exam_Center,
		Qget_byNameStudent,
		Qget_byIDcardStudent,
		Qget_byTaxStudent,
		Qget_byPayment_StudentNif,
		Qget_AllStudent_Exam_Center,
		Qcreate_Student,
		Qdelete_byIdStudent,
		Qupdate_byIdStudent,
		Qget_search
	};
};