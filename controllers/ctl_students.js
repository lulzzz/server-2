const validator = require('node-input-validator');
var ctl_student_license = require("./ctl_student_license");
var ctl_student_notes = require("./ctl_student_note");
var _=require('lodash');
var bodyParser = require('body-parser');
var dbHandlers = require("../db");
let schema=require('../db/schemas/schema_student.json');

// GET request for student
var getList_Student_Exam_Center = (req,res,next)=>{
	// user
	if (req.params.idExam_center>0){
		if(req.query.idStudent){
			//getById
			dbHandlers.Qgen_student.Qget_byIdStudent_Exam_Center(req.query.idStudent,req.params.idExam_center, 
						(err,results)=>{
				if (err){
					res.status(500).send({error:"Database error"});	
				}else if(results.length<=0){
					res.status(204).send({message:"No content"});		
				}else{
					dbHandlers.Qgen_student_notes.Qget_byIDStudent_Student_note(results[0].idStudent,
								(e_note,note)=>{
						if(e_note){
							res.status(500).json({error:"Database error"});
						}else if(note.length<=0){
							res.status(200).json(results);	
						}else{
							results[0].Notes = note;	//Notes
							res.status(200).json(results);
						};
					});
				};
			});
		}else if(req.query.Student_name){
			//getByName
			console.log("Received get student with name " + req.query.Student_name);
			dbHandlers.Qgen_student.Qget_byNameStudent(req.query.Student_name,req.params.idExam_center, 
									(err,results)=>{
				if (err){
					return res.status(500).json({error:"Database error"});	
				}else if(results.length<=0){
					return res.status(204).json({message:"No content"});		
				}else{
					dbHandlers.Qgen_student_notes.Qget_byIDStudent_Student_note(results[0].idStudent,
								(e_note,note)=>{
						if(e_note){
							return res.status(500).json({error:"Database error"});
						}else if(note.length<=0){
							return res.status(200).json(results);
						}else{
							results[0].Notes = note;	//Notes
							return res.status(200).json(results);
						};
					});
				};	
			});
		}else if(req.query.ID_num){
			// get by ID card
			console.log("Received get student with ID_num " + req.query.ID_num);
			dbHandlers.Qgen_student.Qget_byIDcardStudent(req.query.ID_num,req.params.idExam_center, 
									(err,results)=>{
				if (err){
					return res.status(500).json({error:"Database error"});	
				}else if(results.length<=0){
					return res.status(204).json({message:"No content"});		
				}else{
					dbHandlers.Qgen_student_notes.Qget_byIDStudent_Student_note(results[0].idStudent,
								(e_note,note)=>{
						if(e_note){
							return res.status(500).json({error:"Database error"});
						}else if(note.length<=0){
							return res.status(200).json(results);	
						}else{
							results[0].Notes = note;	//Notes
							return res.status(200).json(results);
						};
					});
				};
			});
		}else if(req.query.Tax_num){
			// get by Tax number
			console.log("Received get student with Tax number " + req.query.Tax_num);
			dbHandlers.Qgen_student.Qget_byTaxStudent(req.query.Tax_num,req.params.idExam_center, 
									function(err,results){
				if (err){
					res.status(500).json({error:"Database error"});	
				}else if(results.length<=0){
					res.status(204).json({message:"No content"});		
				}else{
					dbHandlers.Qgen_student_notes.Qget_byIDStudent_Student_note(results[0].idStudent,
								(e_note,note)=>{
						if(e_note){
							res.status(500).json({error:"Database error"});
						}else if(note.length<=0){
							res.status(200).json(results);	
						}else{
							results[0].Notes = note;	//Notes
							res.status(200).json(results);
						};
					});
				};
			});	
		}else if(req.query.Student_license){
			// get by student_license
			console.log("Received get student with Student_license " + req.query.Student_license);
			dbHandlers.Qgen_student_license.Qget_byLicenseStudent(req.query.Student_license,
									req.params.idExam_center,function(err,results){
				if (err){
					res.status(500).json({error:"Database error"});	
				}else if(results.length<=0){
					res.status(204).json({message:"No content"});		
				}else{
					dbHandlers.Qgen_student_notes.Qget_byIDStudent_Student_note(results[0].idStudent,
								(e_note,note)=>{
						if(e_note){
							res.status(500).json({error:"Database error"});
						}else if(note.length<=0){
							res.status(200).json(results);
						}else{
							results[0].Notes = note;	//Notes
							res.status(200).json(results);
						};
					});
				};
			});
		}else{
			// get all under exam center
			console.log("Received get all student with exam center");
			dbHandlers.Qgen_student.Qget_AllStudent_Exam_Center(req.params.idExam_center,function(err,results){
				dbHandlers.Qgen_student_notes.Qget_All_student_Notes((errNotes,resNotes) =>{
					if(errNotes){
						res.status(500).json({message:"Database error"});
					};
					if(err){
						res.status(500).json({message:"Database error"});	
					}else if(results.length<=0){
						res.status(204).json({message:"No content"});	
					}else{
						var jsonResult = [];
						let notes =[];
						var json = new Object();
						for (let i = 0; i < results.length; i++) {
							json = results[i];
							for (let j = 0; j < resNotes.length; j++) {
								if(resNotes[j].Student_idStudent === results[i].idStudent){
									notes.push({
										idStudent_note: resNotes[j].idStudent_note,
										Note: resNotes[j].Note
									});
									json.Notes = notes;
								};
							};
							notes=[]; 
							//this way it's possible to ensure that the specific notes are added to it student
							jsonResult.push(json); //Adds each student and it's notes the the json
						};
						// console.log(jsonResult)
						res.status(200).json(jsonResult.sort((a, b) => a.Student_name.localeCompare(b.Student_name)));
					};
				});
			});
		};
	}else{
		if(req.query.idStudent){
			console.log("Received get by ID without exam center");
			dbHandlers.Qgen_student.Qget_byIdStudent(req.query.idStudent, function(err,results){
				if (err){
					res.status(500).json({error:"Database error"});	
				}else if(results.length<=0){
					res.status(204).json();		
				}else{
					dbHandlers.Qgen_student_notes.Qget_byIDStudent_Student_note(results[0].idStudent,
								(e_note,note)=>{
						if(e_note){
							res.status(500).json({error:"Database error"});
						}else if(note.length<=0){
							res.status(200).json(results);
						}else{
							results[0].Notes = note;	//Notes
							res.status(200).json(results);
						};
					});
				};
			});	
		}else{
			console.log("Received get all student");
			dbHandlers.Qgen_student.Qget_AllStudent(function(err,results){
				dbHandlers.Qgen_student_notes.Qget_All_student_Notes((errNotes,resNotes) =>{
					if(errNotes){
						res.status(500).json({error:"Database error"});
					};
					if(err){
						res.status(500).json({error:"Database error"});	
					}else if(results.length<=0){
						res.status(204).json();	
					}else{
						var jsonResult = [];
						let notes =[];
						var json = new Object();
						for (let i = 0; i < results.length; i++) {
							json = results[i];
							for (let j = 0; j < resNotes.length; j++) {
								if(resNotes[j].Student_idStudent === results[i].idStudent){
									notes.push({
										idStudent_note: resNotes[j].idStudent_note,
										Note: resNotes[j].Note
									});
									json.Notes = notes;
								};
							};
							notes=[]; 
							//this way it's possible to ensure that the specific notes are added to it student
							jsonResult.push(json); //Adds each student and it's notes the the json
						};
						// console.log(jsonResult)
						res.status(200).json(jsonResult.sort((a, b) => a.Student_name.localeCompare(b.Student_name)));
					};
				});
			});
		};
	};
};

// POST request for student
var createStudent=(req,res,next)=>{
	if (!req.query.search){
		// Start promise for schema
		let val = new validator(req.body,schema);
		val.check().then((matched)=>{
		//Different schema
			if (!matched){
				// console.log("fail the schema test");
				console.log(val.errors);
				return res.status(422).json({message:"Fail schema"}); 
			};
			if(req.body.T_ID_type_idT_ID_type && req.body.Type_category_idType_category && req.body.School_idSchool){
				dbHandlers.Qgen_student.Qcreate_Student(req.body.T_ID_type_idT_ID_type,[req.body.Student_name,
										req.body.Student_num,req.body.Birth_date,req.body.ID_num,req.body.ID_expire_date,
										req.body.Tax_num,req.body.Drive_license_num,req.body.Obs],
										(err,results)=>{
					if(err){
						// fail inserting
						console.log(err);
						res.status(500).json({message:"Error creating student"});
					}else{
						// sucess
						// Gets the ID of the new student created
						let tempId=results.insertId;
						console.log("Creating student license! with Student number "+ tempId);
						ctl_student_license.createStudent_license(req,tempId,req.body.School_idSchool,
											req.body.Type_category_idType_category,(err,results)=>{
							if(err){
								// fail inserting
								dbHandlers.Qgen_student.Qdelete_byIdStudent(tempId,(err,results)=>{
									console.log("Student deleted by default");
									res.status(500).json({message:"Error creating student license"});
								});		
							}else{
								res.status(200).json({message:"Student created"});

							};
						});
					};
				});
			}else{
				res.status(400).json({message:"Bad request"});
			};
		});
	}else{
		var conditions = ['School.Exam_center_idExam_center = ?'];
		var values = [req.body.Exam_center_idExam_center];
		var conditionsStr;
		if (typeof req.body.Student_num !== 'undefined') {
			conditions.push('Student.Student_num = ?');
			values.push(req.body.Student_num);
		};
		if (typeof req.body.Student_name !== 'undefined') {
			conditions.push('Student.Student_name LIKE ?');
			values.push("%"+req.body.Student_name+"%");
		};
		if (typeof req.body.T_ID_type_idT_ID_type !== 'undefined') {
			conditions.push('Student.T_ID_type_idT_ID_type = ?');
			values.push(req.body.T_ID_type_idT_ID_type);
		};
		if (typeof req.body.ID_num !== 'undefined') {
			conditions.push('Student.ID_num = ?');
			values.push(req.body.ID_num);
		};
		if (typeof req.body.ID_expire_date !== 'undefined') {
			conditions.push('Student.ID_expire_date = ?');
			values.push(req.body.ID_expire_date);
		};
		if (typeof req.body.Birth_date !== 'undefined') {
			conditions.push('Student.Birth_date = ?');
			values.push(req.body.Birth_date);
		};
		if (typeof req.body.Tax_num !== 'undefined') {
			conditions.push('Student.Tax_num = ?');
			values.push(req.body.Tax_num);
		};
		if (typeof req.body.Drive_license_num !== 'undefined') {
			conditions.push('Student.Drive_license_num = ?');
			values.push(req.body.Drive_license_num);
		};
		if (typeof req.body.Permit !== 'undefined') {
			conditions.push('School.Permit = ?');
			values.push(req.body.Permit);
		};
		if (typeof req.body.School_name !== 'undefined') {
			conditions.push('School.School_name = ?');
			values.push(req.body.School_name);
		};
		if (typeof req.body.Student_license !== 'undefined') {
			conditions.push('Student_license.Student_license = ?');
			values.push(req.body.Student_license);
		};
		if (typeof req.body.Expiration_date !== 'undefined') {
			conditions.push('Student_license.Expiration_date = ?');
			values.push(req.body.Expiration_date);
		};
		// concateneate query
		conditionsStr=conditions.length ? conditions.join(' AND ') : '1';
		dbHandlers.Qgen_student.Qget_search(conditionsStr,values,(err,results)=>{
			if (err){
				console.log(err);
				res.status(500).json({message:"Error getting advance search"});	
			}else{
				res.status(200).json(results);	
			}	
		});
	};
};

// DELETE request for student
var deleteStudent = (req,res,next)=>{
	console.log("Deleting student!");
	if(req.query.idStudent){
		dbHandlers.Qgen_student.Qdelete_byIdStudent(req.query.idStudent,(err,results)=>{
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:"Database error deleting candidate"});
			}else{
				return res.status(200).json({message:"Candidate deleted"});
			};
		});
	}else{
		// missing id for this request
		res.status(400).json({message:"Bad request"});	
	};
};

// UPDATE request for student
async function updateStudent (req,res,next){
	console.log("Updating student");
	if(req.query.idStudent){	
		// Start promise for student
		console.log("registing update student promise")
		var P_update_student = new Promise((resolve,reject)=>{
			let Params_student=_.pick(req.body,['Student_name','Student_num','Birth_date','ID_num','ID_expire_date',
							'Tax_num','Drive_license_num','Obs','T_ID_type_idT_ID_type']);
			if (_.size(Params_student)>0){
				dbHandlers.Qgen_student.Qupdate_byIdStudent(req.query.idStudent, Params_student, function(err,results){
					if(err){
						// internal error
						console.log(err);
						return res.status(500).json({message:"Database error patching candidate"});
						reject(false);
					}else{
						// console.log("resolved update student")
						resolve(true);	
					};
				});
			}else{
				resolve(true);	
			};
		});
	};
	if(req.query.idStudent_license){
		console.log("registing update student license promise")
		var P_update_student_license = new Promise((resolve,reject)=>{
			var Params_student_license =_.pick(req.body,['Student_license',
								'Expiration_date','School_idSchool','Type_category_idType_category']);
			if(_.size(Params_student_license)>0){
				
				ctl_student_license.updateStudent_license(req.query.idStudent_license,Params_student_license, function(err,results2){
					if (err){
						console.log(err);
						return res.status(500).send({message:"Database error patching candidate"});
						reject(false);
					}else{
						console.log("resolved update student license")
						resolve(true);
					};
				});
			}else{
				resolve(true);	
			};
		});
	};

	var update_student= await P_update_student.then();
	var update_student_license= await P_update_student_license.then();

	if (update_student && update_student_license){
		return res.status(200).send({message:"Candidate patched"});
	}else{
		return res.status(500).send({message:"Database error patching candidate"});	
	}

};

module.exports = {
	getList_Student_Exam_Center,
	createStudent,
	deleteStudent,
	updateStudent
}


// ----------------------------------------------------------------------------------

// var getTest=(req,res,next)=>{
// 	if(req.query){
// 		console.log("Have Queries!!");
// 		console.log(req.query);

// 		var dynamicquery="WHERE ";

// 		Student_name=req.query.Student_name;
// 		ID_num=req.query.ID_num;
// 		Student_license=req.query.Student_license;
		
// 		console.log("Variables: "+ Student_name +" , "+ID_num+" , "+Student_license);
// 		if(Student_name){
// 			console.log("I have the key Student_name with value:" + Student_name);
// 			dynamicquery=dynamicquery+ "Student_name=? ,"
// 		};
// 		if(ID_num){

// 			console.log("I have the key ID_num with value:" + ID_num);
// 			dynamicquery=dynamicquery+ "ID_num=? ,"
// 		};
// 		if(Student_license){

// 			console.log("I have the key Student_license with value:" + Student_license);
// 			dynamicquery=dynamicquery+ "Student_license=? ,"
// 		};

// 		console.log("Final query" + dynamicquery);
// 		dbHandlers.Qgen_student.Qget_byIdStudent_Exam_Center(req.query.idStudent,req.params.idExam_center, function(err,results){
// 			if(err){
// 				res.status(500).send(JSON.stringify(err.sqlMessage));
// 			}else if(results.length<=0){
// 				res.status(204).send();	
// 			}else{
// 				res.status(200).send(results);
// 			};
// 		});

// 		// res.status(200).send();
// 	}else{
// 		console.log("Dont have query!");
// 		res.status(200).send();
// 	};
// };

// ----------------------------------------------------------------------------------

// // POST request for student
// async function createStudent(req,res,next){
// 	// Start promise for schema
// 	let val = new validator(req.body,schema);
// 	console.log(req.body);
// 	// Start promise for ID type
	// let P_idT_ID_typecol = new Promise((resolve,reject)=>{
	// 	console.log("started id type");
	// 	if(typeof (req.body.T_ID_type_idT_ID_typecol) == "string"){
	// 		dbHandlers.Qgen_id_type.Qget_byNameID_type(req.body.T_ID_type_idT_ID_typecol,function(err,results){
	// 			if(err || results.length <=0){
	// 				return res.status(500).send("ID type not found");
	// 			}else{
	// 			resolve(results[0].idT_ID_typecol);
	// 			// 	setTimeout(()=>{console.log("ID TYPE timeout");
	// 			// 		resolve(results[0].idT_ID_typecol);
	// 			// }, 1);
	// 			};
	// 		});
	// 	}else if (typeof (req.body.T_ID_type_idT_ID_typecol) == "number"){
	// 		resolve(req.body.T_ID_type_idT_ID_typecol);	

	// 	}else{
	// 		// reject();
	// 		return res.status(422).send("ID type invalid");		
	// 	};
	// });

// 	// Start promise for category license
// 	let P_idType_category= new Promise((resolve,reject)=>{
// 		console.log("started cat");
// 		if(typeof (req.body.Type_category_idType_category) == "string"){
// 			dbHandlers.Qgen_category.Qget_byNameCategories(req.body.Type_category_idType_category,function(err,results){
// 				if(err || results.length <=0){
// 					return res.status(500).send("Category not found");
// 				}else{
// 					resolve(results[0].idType_category);
// 				};
// 			});
// 		}else if (typeof (req.body.Type_category_idType_category) == "number"){
// 			resolve(req.body.T_ID_type_idT_ID_typecol);	
// 		}else{
// 			// param for ID type bad format
// 			return res.status(422).send("Category invalid");
// 		};
// 	});
// 	// Start promise for school
// 	let P_School_idSchool= new Promise((resolve,reject)=>{
// 		console.log("started school");
// 		if(typeof (req.body.School_idSchool) == "string"){
// 			dbHandlers.Qgen_school.Qget_byNameSchool(req.body.School_idSchool,function(err,results){
// 				if(err || results.length <=0){
// 					return res.status(500).send("School not found");
// 				}else{
// 					resolve(results[0].idSchool);	
// 				};
// 			});
// 		}else if (typeof (req.body.School_idSchool) == "number"){
// 			// School_idSchool=req.body.School_idSchool;
// 			resolve(req.body.School_idSchool);	
// 		}else{
// 			return res.status(422).send("School invalid");
// 		};	
// 	});

// 	try{
// 		// Awaits for all promises to complete
// 		let matched = await val.check();
// 		//Different schema
// 		if (!matched){
// 			console.log("fail the schema test");
// 			return res.status(422).send(val.errors); 
// 		};

// 		let idT_ID_typecol=await P_idT_ID_typecol.then();
// 		let idType_category=await P_idType_category.then();
// 		let School_idSchool=await P_School_idSchool.then();

// 	// testingPromise.then((value)=>{
// 	// 	console.log("My promised return ", value)
// 	// }).catch((err)=>{
// 	// 	console.log("My promised return ", err)
// 	// })
// 		console.log("Creating student!");
// 		dbHandlers.Qgen_student.Qcreate_Student(idT_ID_typecol,[req.body.Student_name,
// 								req.body.Birth_date,req.body.ID_num,req.body.ID_expire_date,
// 								req.body.Tax_num,req.body.Drive_license_num,req.body.Obs],
// 								function(err,results){
// 			if(err){
// 				// fail inserting
// 				res.status(500).send(JSON.stringify(err));
// 			}else{
// 				// sucess
// 				// Gets the ID of the new student created
// 				let tempId=results.insertId;
// 				console.log("Creating student license!");
// 				ctl_student_license.createStudent_license(req,tempId,School_idSchool,idType_category,
// 									function(err,results){
// 					if(err){
// 						// fail inserting
// 						dbHandlers.Qgen_student.Qdelete_byIdStudent(tempId, function(err,results){
// 							console.log("Student deleted by default");
// 							res.status(500).send(results);
// 						});		
// 					}else{
// 						res.status(200).send(results);
// 					};
// 				});
// 			};
// 		});
// 	}catch(e){
// 		res.status(422).send('Missing params.')
// 	}
// };




// // UPDATE request for student
// var updateStudent = (req,res,next)=>{
// 	console.log("Updating student");
// 	if(req.query.idStudent){	
// 		// This body can contain data for 2 tables (Student and Student_license)
// 		// Need to parse the body to 2
// 		var Params_student=_.pick(req.body,['Student_name','Student_num','Birth_date','ID_num','ID_expire_date',
// 								'Tax_num','Drive_license_num','Obs','T_ID_type_idT_ID_typecol']);
// 		// console.log(Params_student);
// 		console.log("Params student is "+ Params_student);
// 		console.log("Params student length is "+ Params_student.length);
// 		dbHandlers.Qgen_student.Qupdate_byIdStudent(req.query.idStudent, Params_student, function(err,results){
// 			if(err){
// 				// internal error
// 				console.log(err);
// 				return res.status(500).send({message:"Database error patching candidate"});
// 			}else{
// 				if(req.query.idStudent_license && (req.body.Student_license || req.body.Expiration_date
// 									|| req.body.School_idSchool || req.body.Type_category_idType_category)){
// 					var Params_student_license =_.pick(req.body,['Student_license',
// 											'Expiration_date','School_idSchool','Type_category_idType_category']);
// 					// console.log(Params_student_license);
// 					ctl_student_license.updateStudent_license(req.query.idStudent_license,Params_student_license, function(err,results2){
// 						// console.log("This is second OK"+JSON.stringify(OK));
// 						if (err){
// 							console.log(err);
// 							return res.status(500).send({message:"Database error patching candidate"});
// 						}else{
// 							// console.log("Second result "+results + results2);
// 							return res.status(200).json({message:"Student updated"});
// 						};
// 					});
// 				}else{
// 					// console.log("First result "+results);
// 					return res.status(200).json({message:"Student updated"});
// 				};
// 			};
// 		});
// 	}else{
// 		// missing id for this request
// 		console.log("Bad request");
// 		return res.status(400).send({message:"Bad request"});
// 	};
// };
// ------------------------------------
// function buildConditions(params) {
//   var conditions = [];
//   var values = [];
//   var conditionsStr;

//   if (typeof params.name !== 'undefined') {
//     conditions.push("name LIKE ?");
//     values.push("%" + params.name + "%");
//   }

//   if (typeof params.age !== 'undefined') {
//     conditions.push("age = ?");
//     values.push(parseInt(params.age));
//   }

//   return {
//     where: conditions.length ?
//              conditions.join(' AND ') : '1',
//     values: values
//   };
// }

// var conditions = buildConditions(params);
// var sql = 'SELECT * FROM table WHERE ' + conditions.where;

// connection.query(sql, conditions.values, function(err, results) {
//   // do things
// });