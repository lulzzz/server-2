var dbHandlers = require("../db");
var ctl_pendent_payment=require("./ctl_pendent_payment");

// GET request for bookings
var getList_Exam = (req,res,next)=>{
	console.log("Getting Exams list.");
	if (req.params.idExam_center>0){
		if(req.query.idExam){
			//getById
			dbHandlers.Qgen_exam.Qget_byIdExam_Exam_Center(req.query.idExam,req.params.idExam_center, 
								(err,results)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message:"Database error getting exam"});
				}else if(results.length<=0){
					return res.status(204).json({message:"No results"});	
				}else{
					return res.status(200).json(results);
				};
			});
		}else if(req.query.Exam_date){
			//getBy exam date
			dbHandlers.Qgen_exam.Qget_byExamDateExam_Exam_Center(req.query.Exam_date,
								req.params.idExam_center,(err,results)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message:"Database error getting exam"});
				}else if(results.length<=0){
					return res.status(204).json({message:"No results"});	
				}else{
					return res.status(200).json(results);
				};
			});
		}else if(req.query.Exam_num){
			// get by exam number
			dbHandlers.Qgen_exam.Qget_byExamNumExam_Exam_Center(req.query.Exam_num,
								req.params.idExam_center,(err,results)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message:"Database error getting exam"});
				}else if(results.length<=0){
					return res.status(204).json({message:"No results"});	
				}else{
					return res.status(200).json(results);
				};
			});
		}else{
			//getAll in exam center
			dbHandlers.Qgen_exam.Qget_AllExams_Exam_Center(req.params.idExam_center,(err,results)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message:"Database error getting exam"});
				}else if(results.length<=0){
					return res.status(204).json({message:"No results"});	
				}else{
					return res.status(200).json(results);
				};
			});	
		}
	}else{
		//getAll
		dbHandlers.Qgen_exam.Qget_AllExams((err,results)=>{
			if(err){
				console.log(err);
				return res.status(500).json({message:"Database error getting exam"});
			}else if(results.length<=0){
				return res.status(204).json({message:"No results"});	
			}else{
				return res.status(200).json(results);
			};
		});
	};
};

// POST Exam (FOR NOW ONLY SERVES ADVANCE SEARCH)
var createExam = (req,res,next)=>{
	if(!req.query.search){
		res.status(400).json({message:"Bad Request."});	
	}else{
		var conditions = ['Booked.Exam_center_idExam_center = ?'];
		var values = [req.body.Exam_center_idExam_center];
		var conditionsStr;
		
		if (typeof req.body.Exam_type_idExam_type !== 'undefined') {
			conditions.push('Exam.Exam_type_idExam_type = ?');
			values.push(req.body.Exam_type_idExam_type);
		};
		if (typeof req.body.Permit !== 'undefined') {
			conditions.push('School.Permit = ?');
			values.push(req.body.Permit);
		};
		if (typeof req.body.School_name !== 'undefined') {
			conditions.push('School.School_name LIKE ?');
			values.push("%"+req.body.School_name+"%");
		};
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
		if (typeof req.body.Student_license !== 'undefined') {
			conditions.push('Student_license.Student_license = ?');
			values.push(req.body.Student_license);
		};
		if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 === 'undefined') {
			conditions.push('Timeslot.Timeslot_date = ?');
			values.push(req.body.Timeslot_date1);
		}else if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined'){
			conditions.push('Timeslot.Timeslot_date BETWEEN ? AND ?');
			values.push(req.body.Timeslot_date1);
			values.push(req.body.Timeslot_date2);
		};
		if (typeof req.body.T_exam_status_idexam_status !== 'undefined') {
			conditions.push('Exam.T_exam_status_idexam_status = ?');
			values.push(req.body.T_exam_status_idexam_status);
		};
		if (typeof req.body.T_exam_results_idT_exam_results !== 'undefined') {
			conditions.push('Exam.T_exam_results_idT_exam_results = ?');
			values.push(req.body.T_exam_results_idT_exam_results);
		};
		if (typeof req.body.Pauta_num !== 'undefined') {
			conditions.push('Pauta.Pauta_num = ?');
			values.push(req.body.Pauta_num);
		};
		if (typeof req.body.Payments_idPayments !== 'undefined') {
			conditions.push('Pendent_payments.Payments_idPayments IS NOT NULL');
			// values.push(req.body.Payments_idPayments);
		};
		if (typeof req.body.Car_plate !== 'undefined') {
			conditions.push('Exam.Car_plate = ?');
			values.push(req.body.Car_plate);
		};
		if (typeof req.body.Revision !== 'undefined') {
			conditions.push('Exam.Revision = ?');
			values.push(req.body.Revision);
		};
		if (typeof req.body.Complain !== 'undefined') {
			conditions.push('Exam.Complain = ?');
			values.push(req.body.Complain);
		};
		// concateneate query
		conditionsStr=conditions.length ? conditions.join(' AND ') : '1';
		dbHandlers.Qgen_exam.Qget_search(conditionsStr,values,(err,results)=>{
			if (err){
				console.log(err);
				return res.status(500).json({message:"Error getting advance search"});	
			}else{
				return res.status(200).json(results);	
			};
		});
	};
};


// DELETE request for Exam
var deleteExam = (req,res,next)=>{
	if(req.query.idExam){
		dbHandlers.Qgen_exam.Qdelete_byIdExam(req.query.idExam, function(err,results){
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:"Error deleting Exam"});
			}else{
				return res.status(200).json({message:"Exam deleted"});
			}
		});
	}else{
		// missing id for this request
		res.status(400).json({message:"Bad Request."});	
	};
};

// UPDATE request for Exam
var updateExam = (req,res,next)=>{
	if(req.query.idExam){
		if(req.body.Car_plate||req.body.Drive_license_emit||req.body.Complain||req.body.Revision||
					req.body.T_exam_status_idexam_status||req.body.T_exam_results_idT_exam_results){
			dbHandlers.Qgen_exam.Qupdate_byIdExam(req.query.idExam,[req.body.Car_plate,req.body.Drive_license_emit,
							req.body.Complain,req.body.Revision,req.body.T_exam_status_idexam_status,
							req.body.T_exam_results_idT_exam_results],(err,results)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message:"Error updating Exam"});
				}else{
					return res.status(200).json({message:"Exam updated."});		
				};
			});
		};
	}else{
		// missing values for this request
		return res.status(400).json({message:"Bad Request."});	
	};
};

module.exports = {
	getList_Exam,
	createExam,
	deleteExam,
	updateExam
}


		// if (!F_examiner && !F_reason){
		// 	// need to randomize examiner
		// 	// var Alloc_Examiner = new Promise((resolve,reject)=>{
		// 	// 	// booked has school
		// 	// 	// get exainers with less exams made for that school
		// 	// 	// booked has exam type
		// 	// 	// Examiner_qualificatons has exam type
		// };
		// get exam_number
		// var temp_exam_num = new Promise((resolve,reject)=>{
		// 	dbHandlers.Qgen_booked.Qget_nextExamNum((err,results)=>{
		// 		if (err){
		// 			return res.status(500).send({message:"Error getting exam number"});
		// 		}else{
		// 			console.log("Exam number allocated: " + JSON.stringify(results[0]));
		// 			if (results[0].Exam_num===null){
		// 				resolve(1);
		// 			}else{
		// 				resolve(results[0].Exam_num);
		// 			};	
		// 		};
		// 	});
		// });
		// get pauta num
		// var temp_pauta_num = new Promise((resolve,reject)=>{
		// 	// get booking to get group
		// 	dbHandlers.Qgen_booked.Qget_byIdBooking_Exam_Center(req.body.Booked_idBooked,
		// 				req.params.idExam_center,(err,booking)=>{
		// 		if (err || booking.length<=0){
		// 			return res.status(500).send({message:"Error getting booking"});
		// 		}else{
		// 			console.log("Booking found");
		// 			// check if pauta for given group and date already exists
		// 			dbHandlers.Qgen_booked.Qget_PautaNum(req.body.Exam_date,results[0].Exam_group,
		// 							(err,pauta)=>{
		// 				if (err){
		// 					return res.status(500).send({message:"Database error getting pauta number"});	
		// 				}else if(pauta[0].length<=0 || pauta[0].Pauta_num===null){
		// 					// get next value for pauta if dont exist yet
		// 					dbHandlers.Qgen_booked.Qget_nextPautaNum((err,pauta_num)=>{
		// 						if (err){
		// 							return res.status(500).send({message:"Database error generating pauta number"});	
		// 						}else{
		// 							resolve(pauta_num[0].Pauta_num);
		// 						};
		// 					});
		// 				}else{
		// 					resolve(pauta[0].Pauta_num);
		// 				}	
		// 			});
		// 		};
		// 	});

				// });
				// Pauta Num to be define when exam starts
				// doubt how to grab account id for now force 1
				// Exam_type_idExam_type
// 				dbHandlers.Qgen_booked.Qcreate_Booking([exam_num,1,req.body.Booked_date,	
// 							req.body.Exam_date,req.body.group,req.body.Obs,req.body.Student_license_idStudent_license,
// 							1,req.body.Exam_center_idExam_center,1,1],(err,results)=>{
// 					if(err){
// 					// fail inserting
// 						console.log(err)
// 						res.status(500).send({message:"Error creating booking"});	
// 					}else{
// 						// sucess
// 						res.status(200).json({message:'Booking created!'});		
// 					};	
// 				});
// 			};
// 		});
	
// };


// // POST request for booking
// async function createExam (req,res,next){
// 	// validates schema
// 	console.log("Creating Exam.");
// 	if (req.body.Booked_idBooked && req.body.Car_plate){
// 		var P_booking = new Promise((resolve,reject)=>{
// 			dbHandlers.Qgen_booked.Qget_byIdBooking(req.body.Booked_idBooked,(err,results)=>{
// 				if (err){
// 					console.log(err);
// 					return res.status(500).send({message:"Error getting booking"});
// 				}else{
// 					resolve(results);
// 				};
// 			});
// 		});

// 		var booking = await P_booking.then();
// 		// dbHandlers.Qgen_booked.Qget_byIdBooking(req.body.Booked_idBooked,(err,results)=>{
// 		if (!booking[0].Exam_num){
// 			// generate exam number
// 			var P_exam_num = new Promise((resolve,reject)=>{
// 				dbHandlers.Qgen_booked.Qget_nextExamNum((err,results)=>{
// 					if (err){
// 						console.log(err);
// 						// reject();
// 						return res.status(500).send({message:"Error getting exam number"});
// 					}else{
// 						// console.log("Exam number allocated: " + JSON.stringify(results[0]));
// 						if (results[0].Exam_num===null){
// 							resolve(1);
// 						}else{
// 							resolve(results[0].Exam_num);
// 						};	
// 					};
// 				});
// 			});
// 			// need the booking exam type to randomize the examiner
// 			var exam_num = await P_exam_num.then();

// 			// get pauta id pautas through pauta number in booking
// 			var P_updatebooking = new Promise((resolve,reject)=>{
// 				dbHandlers.Qgen_booked.Qupdate_Booking_ExamNum(req.body.Booked_idBooked,exam_num,(err,results)=>{
// 					if (err){
// 						console.log(err);
// 						return res.status(500).send({message:"Error updating booking"});
// 					}else{
// 						resolve(results);
// 						// dbHandlers.Qgen_booked.Qget_byIdBooking(req.body.Booked_idBooked,(err,results)=>{
// 						// 	if (err){
// 						// 		console.log(err);
// 						// 		return res.status(500).send({message:"Error getting booking"});
// 						// 	}else{
// 						// 		resolve(results);
// 						// 	};
// 						// });
// 					};	
// 				});
// 			});

// 			// console.log("Exam number is " + exam_num);
// 			var P_updatebooking = await P_updatebooking.then();
// 			// console.log("Booking data is " + JSON.stringify(booking));

// 			// Promise to randomizer examiner
// 			var P_examiner=new Promise((resolve,reject)=>{
// 				dbHandlers.Qgen_pauta.Qget_byPauta_num_Pauta(booking[0].Pauta_num,(err,results)=>{
// 					if (err){
// 						return res.status(500).send({message:"Error getting pauta"});	
// 					}else if (!results[0].Examiner_qualifications_idExaminer_qualifications){
// 						// if examiner was never allocated
// 						// console.log("id exam type is "+ booking[0].Exam_type_idExam_type);
// 						dbHandlers.Qgen_examiner_qualification.Qget_byIdExam_type_Examiner_qualification(
// 									booking[0].Exam_type_idExam_type,(err,examiners)=>{
// 							if (err){
// 								console.log(err);
// 								return res.status(500).send({message:"Error randomizing examiner"});
// 							}else if(!results.length){
// 								return res.status(204).send({message:"No examiner available for that type of exam"});	
// 							}else{
// 								console.log("examiner list result " + JSON.stringify(results));
// 								console.log("examiner list result size " + results.length);
// 								temp_examiner = Math.floor(Math.random() * ((results.length-1) - 0 + 1) + 0);
// 								console.log("id random " + temp_examiner);
// 								dbHandlers.Qgen_pauta.Qupdate_Pauta_Examiner_qualifications(
// 											examiners[temp_examiner].idExaminer_qualifications,booking[0].Pauta_num,
// 											(err,results)=>{
// 									if(err){
// 										return res.status(500).send({message:"Error allocating examiner in pauta"});	
// 									}else{
// 										resolve(examiners[temp_examiner]);	
// 									};				
// 								});
// 							};
// 						});
// 					}else{
// 						dbHandlers.Qgen_examiner.Qget_byIdQualification_Examiner(results[0].Examiner_qualifications_idExaminer_qualifications,
// 											(err,results)=>{
// 							if (err){
// 								console.log(err);
// 								return res.status(500).send({message:"Error getting examiner"});	
// 							}else{
// 								resolve(results);	
// 							};
// 						});
// 					};
// 				});
// 			});

// 			// Missing get account person
// 			let random_examiner=await P_examiner.then();
// 			console.log("Examiner selected " + JSON.stringify(random_examiner));

// 			// randomize exam_route

// 			dbHandlers.Qgen_exam.Qcreate_Exam([exam_num,booking[0].Exam_date,req.body.Car_plate,
// 								booking[0].Pauta_num,req.body.Booked_idBooked,1],(err,results)=>{
// 				if(err){
// 					// fail creating exam
// 					console.log(err);
// 					res.status(500).send({message:"Error creating Exam"});	
// 				}else{
// 					// missing pendent payments
// 					// sucess
// 					let tempId=results.insertId;
// 					ctl_pendent_payment.create_pendent_payment(exam_num,booking[0],(err,results)=>{
// 						if (err){
// 							// delete exam
// 							console.log(err);
// 							res.status(500).send({message:"Error creating payment"});		
// 						}else{
// 							res.status(200).json({message:'Exam created!',Examiner_name:random_examiner.Examiner_name,Num:random_examiner.Num});
// 						};
// 					});
// 				};	
// 			});
// 		}else{
// 			// If the user try to stat a exam taht already started
// 			res.status(406).send({message:"Exam already initiated"});	
// 		};
// 	}else{
// 		// missing mandatory fields
// 		res.status(400).send({message:"Bad Request."});	
// 	};
// };