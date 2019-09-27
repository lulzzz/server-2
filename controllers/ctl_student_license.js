var dbHandlers = require("../db");

// GET request for student
var getList_Student_license = (req,res,next)=>{
	if(req.query.Student_license){
		//getById
		dbHandlers.Qgen_student_license.Qget_byIdStudent(req.query.Student_license, function(err,results){
			if(err){
				res.status(500).send(err);
			}else{
				res.status(200).json(results);
			}
		});
	}else{
		//getAll
		dbHandlers.Qgen_student_license.Qget_AllStudent(function(err,results){
			if(err){
				res.status(500).send(err);
			}else{
				res.status(200).json(results);
			}
		});
	};	
};

var createStudent_license=(req,id_student,id_school,id_category,cb)=>{
	// mandatory fields missing
	if (!req.body.Student_license && !req.body.Expiration_date){
		cb(true,'Missing parameters');	
	};
	// check if the key given is the id of the school
	console.log("Creating license");
	dbHandlers.Qgen_student_license.Qcreate_Student_license([req.body.Student_license,
								req.body.Expiration_date,1],id_student,id_school,id_category,
								(err,results)=>{
		if (err){
			console.log(err);
			cb(true,{error:'Database error in student license.'});
		}else{
			cb(null,results);
		};
	});		
};

// UPDATE request for student license
var updateStudent_license = (idStudent_license,body,cb)=>{
	dbHandlers.Qgen_student_license.Qupdate_Student_license(body,idStudent_license,function(err,results){
		if(err){
			// internal error
			cb(true,'Error inserting student license in Database.');
		}else{
			cb(null,results);
		}
	});
};

module.exports = {
	getList_Student_license,
	createStudent_license,
	updateStudent_license
}