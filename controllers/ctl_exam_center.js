const validator = require('node-input-validator');

var dbHandlers = require("../db");
let schema=require('../db/schemas/schema_exam_center.json');

// GET request for exam_center 
var getList_Exam_center = (req,res,next)=>{
	if (req.params.idExam_center>0){
		if(req.query.Exam_center_name){
			//getBy name
			dbHandlers.Qgen_exam_center.Qget_byNameExam_center(req.query.Exam_center_name,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting Exam center by name"});
				}else{
					res.status(200).json(results);
				}
			});
		}else if(req.query.Center_num){
			//getBy center_num
			dbHandlers.Qgen_exam_center.Qget_byCenter_numExam_center(req.query.Center_num,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting Exam center by number"});
				}else{
					res.status(200).json(results);
				}
			});	
		}else{
			//getById
			dbHandlers.Qgen_exam_center.Qget_byIdExam_center(req.params.idExam_center,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting Exam center by id"});
				}else{
					res.status(200).json(results);
				}
			});	
		};		
	}else{
		//getAll
		dbHandlers.Qgen_exam_center.Qget_AllExam_center((err,results)=>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Error getting Exam centers"});
			}else{		
				res.status(200).json(results);
			}
		});
	};
};

// POST request for exam_center
var createExam_center=(req,res,next)=>{
	// validates schema
	let val = new validator(req.body,schema);
    val.check().then((matched)=>{
		//Different schema
		if (!matched){
			console.log(val.errors);
			return res.status(422).json({message:"Fail schema"});  
		}else{
			// mandatory fields missing
			if (!req.body.Exam_center_name && !req.body.Address){
				return res.status(400).json({message:"Bad request"});	
			}
			dbHandlers.Qgen_exam_center.Qcreate_Exam_center([req.body.Exam_center_num,req.body.Exam_center_name,req.body.Address,
										req.body.Center_num,req.body.Center_code,req.body.Tax_num,
										req.body.Zip_code,req.body.Location,req.body.Telephone1,req.body.Telephone2,
										req.body.Email1,req.body.Email2],function (err,results){
				if(err){
					// fail inserting
					console.log(err);
					return res.status(500).json({message:"Error creating exam center"});	
				}else{
					// sucess
					return res.status(200).json({message:"Exam center created"});	
				}
			});
		}	
    });
	
};

// DELETE request for exam_center
var deleteExam_center = (req,res,next)=>{
	if(req.query.idExam_center){
		dbHandlers.Qgen_exam_center.Qdelete_byIdExam_center(req.query.idExam_center, function(err,results){
			if(err){
				console.log(err);
				return res.status(500).json({message:"Error deleting exam center"});
			}else{
				return res.status(200).json({message:"Exam center deleted"});
			}
		});
	}else{
		// missing id for this request
		res.status(400).json({message:"Bad request"});	
	};
};

// UPDATE request for exam_center
var updateExam_center = (req,res,next)=>{
	if(req.query.idExam_center){
		dbHandlers.Qgen_exam_center.Qupdate_byIdExam_center(req.query.idExam_center, req.body, function(err,results){
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:"Error updating Exam Center"});
			}else{
				return res.status(200).json({message:"Exam Center updated"});
			}
		});
	}else{
		// missing id for this request
		return res.status(400).json({message:"Bad request"});	
	}
};

module.exports = {
		getList_Exam_center,
		createExam_center,
		deleteExam_center,
		updateExam_center
}





// ------------------------------------------------------------------------------------------------


	// for (var i=0;i<Object.keys(req.body).length;i++){
	// 	keysString=keysString+Object.keys(data)[i];
	// 	valuesString=valuesString+data[Object.keys(data)[i]];
	// 	if (i<((Object.keys(data).length)-1)){
	// 		keysString=keysString+",";
	// 		valuesString=valuesString+",";
	// 	}
	// }