// get exam price for membership
var Qget_price_associated=(idexam_type,cb)=>{
	return myQuery('SELECT IF(exam_tax_price IS NULL,price,price+exam_tax_price) AS "Value" '+
				'FROM exam_price WHERE exam_price.Exam_type_idExam_type= ?',[idexam_type],(error,results,fields)=>{
		error ? cb(error) : cb(false,results);
	});		
};

// get exam price for no membership
var Qget_price_NO_associated=(idexam_type,cb)=>{
	return myQuery('SELECT IF(exam_tax_price IS NULL,Price_no_associated,Price_no_associated+exam_tax_price) AS "Value" '+
				'FROM exam_price WHERE exam_price.Exam_type_idExam_type= ?',[idexam_type],(error,results,fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

// get emit drive license tax price WITHOUT TAX?
var Qget_price_tax_emit=(idexam_type,cb)=>{
	return myQuery('SELECT exam_price.Tax_emit_drive_license AS "Value" FROM exam_price '+
			'WHERE exam_price.Exam_type_idExam_type= ?',[idexam_type],(error,results,fields)=>{
		error ? cb(error) : cb(false,results);
	});	
};

// put record in school given exam_center id
var Qcreate_Exam_price=(values,idexam_type,idtax,cb)=>{
	return myQuery('INSERT INTO Exam_price (exam_type_letter,exam_type_code,Price,Price_no_associated, '+
							'exam_tax_letter,exam_tax_code,exam_tax_price,emit_drive_license_letter, '+
							'emit_drive_license_code,emit_drive_license_price,' +
							'Exam_type_idExam_type,T_Tax_idT_Tax) VALUES (?,?,?)',
							[values,idexam_type,idtax],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);	
	});
};

var Qupdate_Exam_price=(values,id,cb)=>{
	return myQuery(`UPDATE Exam_price SET ? WHERE idExam_price=?`,[values,id],
							(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};


module.exports = (myQuery)=>{
	return {
		Qget_price_associated,
		Qget_price_NO_associated,
		Qget_price_tax_emit,
		Qcreate_Exam_price,
		Qupdate_Exam_price
	};
};