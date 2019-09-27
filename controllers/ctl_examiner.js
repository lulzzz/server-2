const validator = require('node-input-validator');
var ctl_exam_type = require("./ctl_exam_type");
var dbHandlers = require("../db");
let schema=require('../db/schemas/schema_examiner.json');

// GET request for school
var getList_Examiner_Exam_Center = (req,res,next)=>{
	if (req.params.idExam_center>0){
		if (parseInt(req.query.idExaminer)>0){
			//getById
			dbHandlers.Qgen_examiner.Qget_byIdExaminer_Exam_Center(req.query.idExaminer,
										req.params.idExam_center,function(err,results){
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting examiner"});
				}else{
					res.status(200).json(results);
				};
			});
		}else if(req.query.Examiner_name){
			//getByName
			dbHandlers.Qgen_examiner.Qget_byNameExaminer_Exam_Center(req.query.Examiner_name,
										req.params.idExam_center,function(err,results){
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting examiner"});
				}else{
					res.status(200).json(results);
				};
			});
		}else if(req.query.License_num){
			// get by ID card
			dbHandlers.Qgen_examiner.Qget_byLicenseExaminer_Exam_Center(req.query.License_num,
										req.params.idExam_center,function(err,results){
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting examiner"});
				}else{
					res.status(200).json(results);
				};
			});
		}else if(req.query.Active){
			// get by ID card
			dbHandlers.Qgen_examiner.Qget_ActiveExaminer_Exam_Center(req.params.idExam_center,
							(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting examiner"});
				}else{
					res.status(200).json(results);
				};
			});
		}else{
			//getAll
			dbHandlers.Qgen_examiner.Qget_AllExaminer_Exam_Center(req.params.idExam_center,
										function(err,results){
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting examiner"});
				}else{
					res.status(200).json(results);
				};
			});
		};
	}else{
		if(parseInt(req.query.idExaminer)>0){
			//getById
			dbHandlers.Qgen_examiner.Qget_byIdExaminer(req.query.idExaminer, function(err,results){
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting examiner"});
				}else{
					res.status(200).json(results);
				};
			});
		}else{
			//getAll
			dbHandlers.Qgen_examiner.Qget_AllExaminer(function(err,results){
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting examiner"});
				}else{
					res.status(200).json(results);
				};
			});
		};		
	};
};

// POST request for examiner
var createExaminer =(req,res,next)=>{
	console.log(req.body);
	// validates schema
	if (!req.query.search){
		let val = new validator(req.body,schema);
	    val.check().then((matched)=>{
			//Different schema
			if (!matched){
				console.log(val.errors);
				return res.status(422).json({message:"Fail schema"});   
			};   	
	    });
		// mandatory fields missing
		if (!req.body.Exam_center_idExam_center){
			return res.status(400).json({message:"Bad request"});	
		}else{
			// create examiner given exam_center id
			dbHandlers.Qgen_examiner.Qcreate_Examiner([req.body.Examiner_name,req.body.Num,req.body.License_num,
								req.body.License_expiration,1,req.body.Obs,req.body.Exam_center_idExam_center],
								(err,results)=>{
				if(err){
					console.log(err);
					// fail inserting
					return res.status(500).json({message:"Error creating examiner"});	
				}else{
					// sucess
					let tempId=results.insertId;
					dbHandlers.Qgen_exam_type.Qget_AllExam_type((err,results)=>{
						if(err){
							dbHandlers.Qgen_examiner.Qdelete_byIdExaminer(tempId, (err,results)=>{
							});
							console.log(err);
							return res.status(500).json({message:"Error creating qualifications for examiner"});
						}else{
							if(results.length > 0){
								// console.log(JSON.stringify(results));
								for(let i=0;i<results.length;i++){
									dbHandlers.Qgen_examiner_qualification.Qcreate_Examiner_qualification(
												[null,results[i].idExam_type,tempId],(err2,results2)=>{
										if (err2){
											console.log(err2);
										};
									});;
								};
								return res.status(200).json({message:"Examiner created with all qualifications"});
							}else{ //else exists here because of async	
								return res.status(200).json({message:"Examiner created without qualifications"});
							};
						};
					});
				};
			});
		};
	}else{
		var conditions = ['Examiner.Exam_center_idExam_center = ?'];
		var values = [req.body.Exam_center_idExam_center];
		var conditionsStr;
		if (typeof req.body.Num !== 'undefined') {
			conditions.push('Examiner.Num = ?');
			values.push(req.body.Num);
		};
		if (typeof req.body.Examiner_name !== 'undefined') {
			conditions.push('Examiner.Examiner_name LIKE ?');
			values.push("%"+req.body.Examiner_name+"%");
		};
		if (typeof req.body.License_num !== 'undefined') {
			conditions.push('Examiner.License_num = ?');
			values.push(req.body.License_num);
		};
		if (typeof req.body.License_num !== 'undefined') {
			conditions.push('Examiner.License_num = ?');
			values.push(req.body.License_num);
		};
		if (typeof req.body.License_expiration !== 'undefined') {
			conditions.push('Examiner.License_expiration = ?');
			values.push(req.body.License_expiration);
		};
		if (typeof req.body.Active !== 'undefined') {
			conditions.push('Examiner.Active = ?');
			values.push(req.body.Active);
		};
		// concateneate query
		conditionsStr=conditions.length ? conditions.join(' AND ') : '1';
		dbHandlers.Qgen_examiner.Qget_search(conditionsStr,values,(err,results)=>{
			if (err){
				console.log(err);
				res.status(500).json({message:"Error getting advance search"});	
			}else{
				res.status(200).json(results);	
			}	
		});
	};
};

// DELETE request for exam_center
var deleteExaminer = (req,res,next)=>{
	if(parseInt(req.query.idExaminer)>0){
		dbHandlers.Qgen_examiner.Qdelete_byIdExaminer(req.query.idExaminer, function(err,results){
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:"Error deleting examiner"});
			}else{
				return res.status(200).json({message:"Examiner deleted"});
			};
		});
	}else{
		// missing id for this request
		res.status(400).send({message:"Bad Request"});	
	};
};

// UPDATE request for examiner
var updateExaminer = (req,res,next)=>{
	if(parseInt(req.query.idExaminer)>0){
		dbHandlers.Qgen_examiner.Qupdate_byIdExaminer(req.query.idExaminer, req.body,(err,results)=>{
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:"Error patching examiner"});
			}else{
				return res.status(200).json({message:"Examiner patched"});
			};
		});
	}else{
		return res.status(400).send({message:"Bad Request"});
	};
};

module.exports = {
	getList_Examiner_Exam_Center,
	createExaminer,
	deleteExaminer,
	updateExaminer
}