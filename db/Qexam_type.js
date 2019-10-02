// get record by id in school
var Qget_byIdExam_type =(id, cb)=>{
	return myQuery('SELECT Exam_type.*,Exam_price.*,T_Tax.*,Type_category.Category ' +
						'FROM Exam_type, Exam_price, Type_category, T_Tax '+ 
						'WHERE Exam_type.idExam_type=Exam_price.Exam_type_idExam_type '+
						'AND Exam_type.Type_category_idType_category=Type_category.idType_category '+
						'AND Exam_price.T_Tax_idT_Tax=T_Tax.idT_Tax '+
						'AND Exam_type.idExam_type = ?',[id], (error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_AllExam_type =(cb)=>{
	return myQuery('SELECT Exam_type.*,Exam_price.*,T_Tax.*,Type_category.Category ' +
						'FROM Exam_type, Exam_price, Type_category, T_Tax ' + 
						'WHERE Exam_type.idExam_type=Exam_price.Exam_type_idExam_type ' +
						'AND Exam_type.Type_category_idType_category=Type_category.idType_category ' +
						'AND Exam_price.T_Tax_idT_Tax=T_Tax.idT_Tax',
						null,(error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

// create record for student 
var Qcreate_Exam_type = (values,cb)=>{
	return myQuery ('INSERT INTO Exam_type (Exam_type_name,Short,Description,Has_route,Num_examiners, ' +
							'Num_students,Duration,Minimun_age,Has_license,Has_Pair, ' +
							'Final_exam,Code,High_way,Condicioned_route,Type_category_idType_category) ' +
							'values (?)',[values],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);			
	});
};

// delete record by id in student
var Qdelete_byIdExam_type=(id,cb)=>{
	return myQuery('DELETE FROM Exam_type WHERE idExam_type = ?',[id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);
	})
};

// update record in student
var Qupdate_byIdExam_type=(id,values,cb)=>{
	return myQuery('UPDATE Exam_type SET ? where idExam_type=?',[values,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
}

module.exports = function(myQuery){
	return {
		Qget_byIdExam_type,
		Qget_AllExam_type,
		Qcreate_Exam_type,
		Qdelete_byIdExam_type,
		Qupdate_byIdExam_type
	};
};



// [Exam_type_name,Short,Description,Has_route,Num_examiners,Num_students,Duration,Multiple_schools,
// 									Minimun_age,Has_license,Has_Pair,
// 									Final_exam,Code,High_way,
									// Condicioned_route,Type_category_idType_category]

// var Qget_byNameExam_type =(name, cb)=>{
// 	return myQuery('SELECT Exam_type.idExam_type,Exam_type.Exam_type_name,Exam_type.Short,Exam_type.Description,'+
// 						'Exam_type.Has_route,Exam_type.Num_examiners,Exam_type.Num_students,Exam_type.Duration,'+
// 						'Exam_type.Multiple_schools,Exam_type.Minimun_age,Exam_type.Has_license,Exam_type.Has_pair,'+
// 						'Exam_type.Final_exam,Exam_type.Code,Exam_type.High_way,Exam_type.Condicioned_route, '+
// 						'Exam_price.Price,Exam_price.Price_no_associated,Exam_price.Tax, '+
// 						'Exam_price.Tax_emit_drive_license,Type_category.Category ' +
// 						'FROM Exam_type,Exam_price, Type_category '+ 
// 						'WHERE Exam_type.Exam_price_idExam_price=Exam_price.idExam_price '+
// 						'AND Exam_type.Type_category_idType_category=Type_category.idType_category '+
// 						'AND Exam_type_name = ?',[name], (error, results, fields) =>{
// 		error ? cb(error) : cb(false,results);
// 	});
// };

// var Qget_byShortExam_type =(short, cb)=>{
// 	return myQuery('SELECT Exam_type.idExam_type,Exam_type.Exam_type_name,Exam_type.Short,Exam_type.Description,'+
// 						'Exam_type.Has_route,Exam_type.Num_examiners,Exam_type.Num_students,Exam_type.Duration,'+
// 						'Exam_type.Multiple_schools,Exam_type.Minimun_age,Exam_type.Has_license,Exam_type.Has_pair,'+
// 						'Exam_type.Final_exam,Exam_type.Code,Exam_type.High_way,Exam_type.Condicioned_route, '+
// 						'Exam_price.Price,Exam_price.Price_no_associated,Exam_price.Tax, '+
// 						'Exam_price.Tax_emit_drive_license,Type_category.Category ' +
// 						'FROM Exam_type,Exam_price, Type_category '+ 
// 						'WHERE Exam_type.Exam_price_idExam_price=Exam_price.idExam_price '+
// 						'AND Exam_type.Type_category_idType_category=Type_category.idType_category '+
// 						'AND Short = ?',[short], (error, results, fields) =>{
// 		error ? cb(error) : cb(false,results);
// 	});
// };