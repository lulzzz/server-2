// get all records in Exam_route
var Qget_AllExam_Routes = (cb)=>{
	return myQuery('SELECT * FROM Exam_route',null,  (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in Exam_route
var Qget_byIdExam_Route =(id, cb)=>{
	return myQuery('SELECT * FROM Exam_route WHERE idExam_route = ?',[id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// get exam route ids
var Qget_AllIdExam_Routes=(idexam_center,cb)=>{
		return myQuery('SELECT idExam_route FROM Exam_route WHERE Active=1 '+
					'AND Exam_center_idExam_center=?',
					[idexam_center],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});	
};

//post Exam_route
var Qcreate_Exam_Route = (values,cb) =>{
	return myQuery('INSERT INTO Exam_route (Route,Active,Code,High_way,Conditioned_route,'+
							'Exam_center_idExam_center) VALUES (?)', [values],(error,results,fields)=>{
		error ? cb(error) : cb(false,results)
	});
};

//delete Exam_route by Id
var Qdelete_Exam_Route = (id,cb) =>{
	return myQuery('DELETE FROM Exam_route WHERE idExam_route = ?',[id],(error,results,fields)=>{
		error ? cb(error) : cb(false,results)
	});
};

//update Exam_route by id
var Qupdate_Exam_Route = (id,values,cb) =>{
	return myQuery('UPDATE Exam_route SET ? WHERE idExam_route = ?',[values,id],
						(error,results,fields)=>{
		error ? cb(error) : cb(false,results)
	});
};

module.exports = function(myQuery){
	return {
		Qget_AllExam_Routes,
		Qget_byIdExam_Route,
		Qget_AllIdExam_Routes,
		Qcreate_Exam_Route,
		Qdelete_Exam_Route,
		Qupdate_Exam_Route
	};
};