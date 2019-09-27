const validator = require('node-input-validator');
var dbHandlers = require("../db");
let schema=require('../db/schemas/schema_school.json');
const _ = require('lodash');
const ctl_invoice_info = require('./ctl_invoice_info');
var config=require('../config.json');
var request= require('request');

// GET request for school (superuser)
var getList_School_Exam_Center = (req,res,next)=>{
	console.log("Getting School.");
	if (req.params.idExam_center>0 && req.query.filter){
		if(req.query.filter==="School_name"){
			dbHandlers.Qgen_school.Qget_School_Names_Exam_Center(req.params.idExam_center,function(err,results){
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting school names"});
				}else{
					res.status(200).json(results);
				}
			});
		}else if(req.query.filter==="School_name_permit"){
			dbHandlers.Qgen_school.Qget_School_Names_Permit_Exam_Center(req.params.idExam_center,function(err,results){
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting school names with permit"});
				}else{
					res.status(200).json(results);
				}
			});			
		}else{
			res.status(400).json({message:"Bad Request."});		
		};
	}else{
		// user
		if (req.params.idExam_center>0){
			if(req.query.idSchool){
				//getById
				dbHandlers.Qgen_school.Qget_byIdSchool_Exam_Center(req.query.idSchool,req.params.idExam_center, 
											function(err,results){
					if(err){
						console.log(err);
						res.status(500).json({message:"Database error getting school by id"});
					}else if(results.length<=0){
						res.status(204).json({message:"No data found"});	
					}else{
						res.status(200).json(results);
					}
				});
			}else if(req.query.School_name){
				//getByName
				dbHandlers.Qgen_school.Qget_byNameSchool_Exam_Center(req.query.School_name,req.params.idExam_center,
											function(err,results){
					if(err){
						console.log(err);
						res.status(500).json({message:"Database error getting school by name"});
					}else if(results.length<=0){
						res.status(204).json({message:"No data found"});	
					}else{
						res.status(200).json(results);
					}
				});
			}else if(req.query.Associate_num){
				// get by associate number
				dbHandlers.Qgen_school.Qget_byAssociateSchool_Exam_Center(req.query.Associate_num,req.params.idExam_center, 
											function(err,results){
					if(err){
						console.log(err);
						res.status(500).json({message:"Database error getting school"});
					}else if(results.length<=0){
						res.status(204).json();	
					}else{
						res.status(200).json(results);
					}
				});
			}else if(req.query.Permit){
				// get by associate number
				dbHandlers.Qgen_school.Qget_byPermitSchool_Exam_Center(req.query.Permit,req.params.idExam_center, 
											function(err,results){
					if(err){
						console.log(err);
						res.status(500).json({message:"Database error getting school"});
					}else if(results.length<=0){
						res.status(204).json();	
					}else{
						res.status(200).json(results);
					}
				});
			}else{
				//getAll
				dbHandlers.Qgen_school.Qget_AllSchool_Exam_Center(req.params.idExam_center,function(err,results){
					if(err){
						console.log(err);
						res.status(500).json({message:"Database error getting school"});
					}else if(results.length<=0){
						res.status(204).json();	
					}else{
						// console.log(results);
						res.status(200).json(results);
					}
				});	
			}
		}else{
			//getAll
			dbHandlers.Qgen_school.Qget_AllSchool(function(err,results){
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting school"});
				}else if(results.length<=0){
						res.status(204).json();	
				}else{
					// console.log(results);
					res.status(200).json(results);
				}
			});
		};
	};
};

// POST request for school
var createSchool = (req,res,next)=>{
	if (!req.query.search){
		// validates schema
		let val = new validator(req.body,schema);
	    val.check().then((matched)=>{
			//Different schema
			if (!matched){
				console.log(val.errors);
				res.status(422).json({message:"Fail schema"});   
			}else{
				// mandatory fields
				if (req.body.Exam_center_idExam_center && req.body.Delegation_idDelegation){
					dbHandlers.Qgen_school.Qcreate_School([req.body.Permit,req.body.Associate_num,
										req.body.School_name,req.body.Address,req.body.Tax_num,req.body.Zip_code,
										req.body.Location,req.body.Obs,req.body.Telephone1,req.body.Telephone2,
										req.body.Email1,req.body.Email2,req.body.Exam_center_idExam_center,
										req.body.Delegation_idDelegation],function (err,results){
						if(err){
							// fail inserting
							console.log(err);
							res.status(500).json({message:"Error creating school"});	
						}else{
							// sucess
							if (req.body.Invoice_name||req.body.Invoice_address||req.body.Invoice_location||
												req.body.Invoice_zip_code||req.body.Invoice_tax_number){
								let idSchool = results.insertId;
								ctl_invoice_info.createInvoice_info(req.body,idSchool, 
											(err,results) =>{
									if(err){
										dbHandlers.Qgen_school.Qdelete_byIdSchool(idSchool,() =>{
										});
										console.log(err);
										res.status(500).json({message:"Error creating school"});
									}else{
										// create invoice info external api since exists invoice info
										let customer_json={
											name: req.body.Invoice_name,
										    nif: req.body.Invoice_tax_number,
										    address: req.body.Invoice_address,
										    postalCode: req.body.Invoice_zip_code,
										    city: req.body.Invoice_location,
										    country: "PT",
										    permit:req.body.Permit
										};
										request({
											url:config.api_invoice.url_customer,
											method: 'POST',
											json:customer_json
										},(error, response, body)=>{
											if (error){
												// log api error received
											}else{
												// sucess
												console.log("Customer created");
											}
										});
										res.status(200).json({message:'School created!'});
									};
								});
							}else{
								res.status(200).json({message:'School created!'});		
							};
						};
					});
				}else{
					// missing mandatory fields
					res.status(400).json({message:"Bad Request."});	
				};
		  	};
		});
	}else{
		var conditions = ['school_info.Exam_center_idExam_center = ?'];
		var values = [req.body.Exam_center_idExam_center];
		var conditionsStr;

		if (typeof req.body.Permit !== 'undefined') {
			conditions.push('school_info.Permit = ?');
			values.push(req.body.Permit);
		};
		if (typeof req.body.Associate_num !== 'undefined') {
			conditions.push('school_info.Associate_num = ?');
			values.push(req.body.Associate_num);
		};
		if (typeof req.body.School_name !== 'undefined') {
			conditions.push('school_info.School_name LIKE ?');
			values.push("%"+req.body.School_name+"%");
		};
		if (typeof req.body.Address !== 'undefined') {
			conditions.push('school_info.Address LIKE ?');
			values.push("%"+req.body.Address+"%");
		};
		if (typeof req.body.Zip_code !== 'undefined') {
			conditions.push('school_info.Zip_code = ?');
			values.push(req.body.Zip_code);
		};
		if (typeof req.body.Location !== 'undefined') {
			conditions.push('school_info.Location = ?');
			values.push(req.body.Location);
		};
		if (typeof req.body.Telephone1 !== 'undefined') {
			conditions.push('school_info.Telephone1 = ?');
			values.push(req.body.Telephone1);
		};
		if (typeof req.body.Email1 !== 'undefined') {
			conditions.push('school_info.Email1 LIKE ?');
			values.push("%"+req.body.Email1+"%");
		};
		if (typeof req.body.Tax_num !== 'undefined') {
			conditions.push('school_info.Tax_num = ?');
			values.push(req.body.Tax_num);
		};
		if (typeof req.body.Delegation_idDelegation !== 'undefined') {
			conditions.push('school_info.Delegation_idDelegation = ?');
			values.push(req.body.Delegation_idDelegation);
		};
		if (typeof req.body.Invoice_name !== 'undefined') {
			conditions.push('school_info.Invoice_name LIKE ?');
			values.push("%"+req.body.Invoice_name+"%");
		};
		if (typeof req.body.Invoice_email !== 'undefined') {
			conditions.push('school_info.Invoice_email LIKE ?');
			values.push("%"+req.body.Invoice_email+"%");
		};
		// concateneate query
		conditionsStr=conditions.length ? conditions.join(' AND ') : '1';
		dbHandlers.Qgen_school.Qget_search(conditionsStr,values,(err,results)=>{
			if (err){
				console.log(err);
				res.status(500).json({message:"Error getting advance search"});	
			}else{
				res.status(200).json(results);	
			};
		});
	};
};

// DELETE request for School
var deleteSchool = (req,res,next)=>{
	if(req.query.idSchool){
		dbHandlers.Qgen_school.Qdelete_byIdSchool(req.query.idSchool, function(err,results){
			if(err){
				// internal error
				console.log(err);
				return res.status(500).send({message:"Error deleting school"});
			}else{
				return res.status(200).json({message:"School deleted"});
			}
		});
	}else{
		// missing id for this request
		res.status(400).send({message:"Missing params"});	
	};
};

// UPDATE request for School
var updateSchool = (req,res,next)=>{
	// console.log("Update school");
	if(req.query.idSchool){
		var schoolFields = _.pick(req.body,['Permit','Associate_num','School_name','Address','Tax_num',
							'Zip_code','Location','Obs','Telephone1','Telephone2','Email1','Email2',
							'Exam_center_idExam_center','Delegation_idDelegation']);
		dbHandlers.Qgen_school.Qupdate_byIdSchool(req.query.idSchool,schoolFields,function(err,results){
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:"Database error updating school."});
			}else{
				if(req.body.Invoice_name||req.body.Invoice_address||req.body.location|| 
							req.body.zip_code||req.body.Invoice_tax_number||req.body.Invoice_email){
					dbHandlers.Qgen_invoice_info.Qget_byIDSchool_Invoice_info(req.query.idSchool,(err,resultado)=>{
						if(err){
							console.log(err);
							res.status(500).json({message:"Database error getting ID school."});
						}else if(resultado.length <= 0){
							invoiceFields = _.pick(req.body,['Invoice_name', 'Invoice_address', 
										'Invoice_location', 'Invoice_zip_code', 'Invoice_tax_number',
										'Invoice_email','Send_invoice_email']);
							ctl_invoice_info.createInvoice_info(invoiceFields,req.query.idSchool,(err,results)=>{
								if(err){
									console.log(err);
									return res.status(500).json({message:"Database error creating school invoice info."});
								}else{
									return res.status(200).json({message:"School updated."});		
								};
							});
						}else{
							console.log(JSON.stringify(resultado));
							invoiceFields = _.pick(req.body,['Invoice_name', 'Invoice_address', 
										'Invoice_location', 'Invoice_zip_code', 'Invoice_tax_number',
										'Invoice_email','Send_invoice_email']);
							ctl_invoice_info.updateInvoice_info(invoiceFields,req.query.idSchool,resultado[0].Invoice_tax_number,(err,results)=>{
								if(err){
									console.log(err);
									return res.status(500).json({message:"Database error updating school invoice info."});
								}else{
									return res.status(200).json({message:"School updated."});		
								};
							});	
						};
					});
				}else{
					return res.status(200).json({message:"School updated."});	
				};
			};
		});
	}else{
		// missing id for this request
		return res.status(400).json({message:"Missing params."});	
	};
};

module.exports = {
	getList_School_Exam_Center,
	createSchool,
	deleteSchool,
	updateSchool
}


// POST request for school
// var createSchool = (req,res,next)=>{
// 	// validates schema
// 	let val = new validator(req.body,schema);
//     val.check().then((matched)=>{
// 		//Different schema
// 		if (!matched){
// 			res.status(422).send(val.errors);   
// 		}    	
//     });
// 	// mandatory fields missing
// 	if (!req.body.Permit && !req.body.School_name && !req.body.Address && !req.body.Tax_num){
// 		res.status(400).send();	
// 	};
// 	// Promise to get the IDs mandatories for the next query
// 	var PromiseGetIDs = new Promise((resolve,reject)=>{
// 		let idExam_center;
// 		if(req.body.idExam_center){
// 			idExam_center=req.body.idExam_center
// 		}else if(req.body.Exam_center_name){
// 			// create school given exam_center name
// 			dbHandlers.Qgen_exam_center.Qget_IdbyNameExam_center(req.body.Exam_center_name,function (err,results){
// 				if(err || results.length <=0){
// 					// fail inserting
// 					// return res.status(500).send(err);
// 					reject(err);
// 				}else{
// 					resolve(results[0].idExam_center);
// 				}
// 			});
// 		}	
// 	});
// 	// create school given exam_center id
// 	PromiseGetIDs.then(function(result){
// 		idExam_center=result;
// 		dbHandlers.Qgen_school.Qcreate_School([req.body.Permit,req.body.Associate_num,req.body.School_name,
// 						req.body.Address,req.body.Tax_num,req.body.Zip_code,req.body.Location,req.body.Obs,
// 						req.body.Telephone1,req.body.Telephone2,req.body.Fax1,req.body.Fax2,
// 						req.body.Email1,req.body.Email2],idExam_center,function (err,results){
// 			if(err){
// 				// fail inserting
// 				res.status(500).send(err);	
// 			}else{
// 				// sucess
// 				res.status(200).send(results);	
// 			}
// 		})
// 	}).then({
// 		// Missing reject for first query
// 		// res.status(500).send(err);
// 	});
// };