var dbHandlers = require("../db");

// GET request for examiner qualifications
var getList_Examiner_qualifications = (req,res,next)=>{
	if (req.query.Examiner_idExaminer){
		//getById
		dbHandlers.Qgen_examiner_qualification.Qget_byIdExaminer_Examiner_qualification(
						req.query.Examiner_idExaminer,function(err,results){
			if(err){
				res.status(500).send({err:"Error getting qualifications"});
			}else{
				res.status(200).json(results);
			};
		});
	}else{
		res.status(400).send({err:"Bad request"});	
	};
};

// POST request for examiner qualifications
var createExaminer_qualification =(req,res,next)=>{
	// mandatory fields missing
	if (req.body.Exam_type_idExam_type && req.body.Examiner_idExaminer){
		// create examiner qualifications given examiner id
		dbHandlers.Qgen_examiner_qualification.Qcreate_Examiner_qualification([req.body.Note,
						req.body.Exam_type_idExam_type,req.body.Examiner_idExaminer],function (err,results){
			if(err){
				// fail inserting
				return res.status(500).send({error:"Error creating examiner qualification"});	
			}else{
				return res.status(200).send({message:"Examiner qualification created"});
			};
		});
	}else{
		return res.status(400).send({error:"Bad request"});
	};
};

// DELETE request for examiner qualifications
var deleteExaminer_qualification = (req,res,next)=>{
	if(req.query.idExaminer_qualifications){
		dbHandlers.Qgen_examiner_qualification.Qdelete_byIdExaminer_qualification(
						req.query.idExaminer_qualifications, function(err,results){
			if(err){
				// internal error
				return res.status(500).send({error:"Error deleting examiner qualification"});
			}else{
				return res.status(200).json({message:"Examiner qualification deleted"});
			};
		});
	}else{
		// missing id for this request
		res.status(400).send({error:"Bad request"});	
	};
};

module.exports = {
	getList_Examiner_qualifications,
	createExaminer_qualification,
	deleteExaminer_qualification
}

// // UPDATE request for exam_center
// var updateExaminer = (req,res,next)=>{
// 	if(!req.query.idExaminer){
// 		// missing id for this request
// 		return res.status(400).send(err);	
// 	};
// 	dbHandlers.Qgen_examiner.Qupdate_byIdExaminer(req.query.idExaminer, req.body, function(err,results){
// 		if(err){
// 			// internal error
// 			return res.status(500).send(err);
// 		}else{
// 			return res.status(200).json(results);
// 		};
// 	});
// };

