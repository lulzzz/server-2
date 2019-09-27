// get all records in school
var Qget_AllSchool = (cb)=>{
	return myQuery('SELECT School.*,Invoice_info.*,T_delegation.* '+
					'FROM School LEFT JOIN Invoice_info ON School.idSchool = Invoice_info.School_idSchool '+
					'LEFT JOIN T_delegation ON School.Delegation_idDelegation = T_delegation.idDelegation '+
					'ORDER BY School_name ASC',
					null,(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all records in school given exam_center
var Qget_AllSchool_Exam_Center = (idexam_center,cb)=>{
	return myQuery('SELECT idSchool,Permit,Associate_num,School_name,Email1 '+
					'FROM School WHERE Exam_center_idExam_center = ?',[idexam_center],
					(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get record by name in school
var Qget_byIdSchool_Exam_Center =(id,idexam_center, cb)=>{
	return myQuery('SELECT School.*,Invoice_info.*,T_delegation.* '+
					'FROM School LEFT JOIN Invoice_info ON idSchool = School_idSchool '+
					'LEFT JOIN T_delegation ON School.Delegation_idDelegation = T_delegation.idDelegation '+
					'WHERE School.idSchool = ? AND School.Exam_center_idExam_center=?',
					[id,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by name in school
var Qget_byNameSchool_Exam_Center =(name,idexam_center, cb)=>{
	return myQuery('SELECT School.*,Invoice_info.*,T_delegation.* '+
					'FROM School LEFT JOIN Invoice_info ON School.idSchool = Invoice_info.School_idSchool '+
					'LEFT JOIN T_delegation ON School.Delegation_idDelegation = T_delegation.idDelegation '+
					'WHERE School.School_name LIKE ? AND School.Exam_center_idExam_center = ? ',
					["%"+name+"%",idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get record by Associate_num in school
var Qget_byAssociateSchool_Exam_Center = (associate_num,idexam_center, cb)=>{
	return myQuery('SELECT School.*,Invoice_info.*,T_delegation.* '+
					'FROM School LEFT JOIN Invoice_info ON idSchool = School_idSchool '+
					'LEFT JOIN T_delegation ON School.Delegation_idDelegation = T_delegation.idDelegation '+
					'WHERE School.Associate_num = ? AND School.Exam_center_idExam_center = ? ',
					[associate_num,idexam_center], (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get school by permit
var Qget_byPermitSchool_Exam_Center=(permit,idexam_center,cb)=>{
	return myQuery('SELECT school.*,Invoice_info.*,T_delegation.* '+
					'FROM school LEFT JOIN Invoice_info ON idSchool = School_idSchool '+
					'LEFT JOIN T_delegation ON School.Delegation_idDelegation = T_delegation.idDelegation '+
					'WHERE School.Permit=? AND School.Exam_center_idExam_center = ?',[permit,idexam_center],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);	
	});
};

// get all school names for given exam center
var Qget_School_Names_Exam_Center =(id_center_exam, cb)=>{
	return myQuery('SELECT idSchool,School_name FROM School WHERE Exam_center_idExam_center=? '+
								'ORDER BY School_name ASC', [id_center_exam], (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all school names for given exam center
var Qget_School_Names_Permit_Exam_Center =(id_center_exam, cb)=>{
	return myQuery('SELECT idSchool,School_name,Permit FROM School WHERE Exam_center_idExam_center=? '+
								'ORDER BY School_name ASC', [id_center_exam], (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get the membership number of the school
var Qget_School_Associated=(idstudent_license,cb)=>{
	return myQuery('SELECT School.Associate_num FROM School,student_license '+
					'WHERE student_license.School_idSchool=School.idSchool '+
					'AND student_license.idStudent_license=? LIMIT 1',
					[idstudent_license],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get nif and school name for given pendent payment
var Qget_byPayment_SchoolNif=(idpayment,cb)=>{
	return myQuery('SELECT School.Invoice_name,School.Invoice_tax_number '+
					'FROM Student, Student_license,Transactions '+
					'WHERE Transactions.School_idSchool=School.idSchool '+
					'AND Transactions.Payments_idPayments=?',
					[idpayment],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// put record in school given exam_center id
var Qcreate_School=(values,cb)=>{
	return myQuery(`INSERT INTO School (Permit,Associate_num,School_name,Address,Tax_num,` +
							`Zip_code,Location,Obs,Telephone1,Telephone2,Email1,Email2,` +
							`Exam_center_idExam_center,Delegation_idDelegation) values (?)`,[values],
							(error, results, fields)=> {
		error ? cb(error) : cb(false,results);	
	});
};

// delete record by id in school
var Qdelete_byIdSchool=(id,cb)=>{
	return myQuery('DELETE FROM School WHERE idSchool = ?',[id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);
	})
};

// update record in school
var Qupdate_byIdSchool=(id,values,cb)=>{
	return myQuery('UPDATE School SET ? where idSchool=?',[values,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

// -----------------------------------ADVANCE SEARCH------------------------------------------
var Qget_search=(query,values,cb)=>{
	let customQuery='SELECT * '+
				'FROM school_info '+
				'WHERE ' + query;
	return myQuery(customQuery,values,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

module.exports = function(myQuery){
	return {
		Qget_AllSchool,
		Qget_AllSchool_Exam_Center,
		Qget_byIdSchool_Exam_Center,
		Qget_byNameSchool_Exam_Center,
		Qget_byAssociateSchool_Exam_Center,
		Qget_byPermitSchool_Exam_Center,
		Qget_School_Names_Exam_Center,
		Qget_School_Names_Permit_Exam_Center,
		Qget_School_Associated,
		Qcreate_School,
		Qdelete_byIdSchool,
		Qupdate_byIdSchool,
		Qget_search
	};
};