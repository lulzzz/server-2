var config=require('../config.json');
var dbHandlers = require("../db");
var moment = require('moment');
var _=require('lodash');

// GET request for bookings
var getList_Pauta_Exam_Center = (req,res,next)=>{
	console.log("Getting Pautas.");
	if (req.params.idExam_center>0){
		if(req.query.idPauta){
			//get pauta by id
			dbHandlers.Qgen_pauta.Qget_byIdPauta(req.query.idPauta,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting Pautas"});
				}else if(results.length<=0){
					// console.log("No content id " + results);
					res.status(204).json({message:"No results"});	
				}else{
					// console.log(results);
					res.status(200).json(results);
				};
			});	
		}else{
			//getAll by exam center
			dbHandlers.Qgen_pauta.Qget_byExam_Center_AllPautas(req.params.idExam_center,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting Pautas"});
				}else if(results.length<=0){
					// console.log("No content exam center " + results);
					res.status(204).json({message:"No results"});	
				}else{
					// console.log(results);
					res.status(200).json(results);
				};
			});
		};
	}else{
		//getAll
		dbHandlers.Qgen_pauta.Qget_AllPautas((err,results)=>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Error getting Pautas"});
			}else if(results.length<=0){
				console.log("No content all " + results);
				res.status(204).json({message:"No results"});	
			}else{
				// console.log(results);
				res.status(200).json(results);
			};
		});
	};
};

// function to pass parameters to promise
var P_create_pauta= async (values) => {
	return await new Promise((resolve,reject)=>{
		try{
			// console.log("pauta launch")
			dbHandlers.Qgen_pauta.Qcreate_Pauta(values,(err,results)=>{
				if (err){
					console.log(err);
					reject(err);
				}else{
					// console.log(values);
	  				resolve();
				};
	  		});		
		}catch (err){
			console.log(err);
			return reject(err);
		};
	});
};

// POST request for pauta
var createPauta = async (req,res,next)=>{
	if (!req.query.search){
		if (req.params.idExam_center && req.body.Timeslot_date){
			dbHandlers.Qgen_pauta.Qget_MAXPautaNum(req.params.idExam_center,(err,results)=>{
				if (err){
					console.log(err);
					res.status(500).json({message:"Error getting pauta numbers"});	
				}else{
					var temp_pauta_num=results[0].pauta_num;
					// console.log("got max pauta " +JSON.stringify(results));
					dbHandlers.Qgen_timeslot.Qget_byDateTimeslot(req.params.idExam_center,
							req.body.Timeslot_date,(err,results)=>{	
							console.log("got timeslot date")
						if (err || results.length<=0){
							console.log(err);
							res.status(500).json({message:"No records found in database"});		
						}else{
							// array of promises to create pautas
							var array_P_pautas=[];
							results.forEach((element)=>{
								temp_pauta_num = temp_pauta_num + 1;
								array_P_pautas.push(P_create_pauta([temp_pauta_num,element.idTimeslot,1,
										element.Exam_type_idExam_type]));
							});
							Promise.all(array_P_pautas)
	            				.then(()=>{
									res.status(200).json({message:"Pautas created"});	
								}).catch((err)=>{
					                // log that I have an error, return the entire array;
					                console.log(err);
					                res.status(500).json({message:"Database error creating pautas"});
	            				});				
						};
					});		
				};
			});
		}else{
			// missing id for this request
			res.status(400).send({message:"Bad Request."});	
		};
	}else{
		var conditions = ['Timeslot.Exam_center_idExam_center = ?'];
		var values = [req.body.Exam_center_idExam_center];
		var conditionsStr;
		
		if (typeof req.body.Exam_type_idExam_type !== 'undefined') {
			conditions.push('Pauta.Exam_type_idExam_type = ?');
			values.push(req.body.Exam_type_idExam_type);
		};
		if (typeof req.body.Pauta_num !== 'undefined') {
			conditions.push('Pauta.Pauta_num = ?');
			values.push(req.body.Pauta_num);
		};
		if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 === 'undefined') {
			conditions.push('Timeslot.Timeslot_date = ?');
			values.push(req.body.Timeslot_date1);
		}else if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined') {
			conditions.push('Timeslot.Timeslot_date BETWEEN ? AND ?');
			values.push(req.body.Timeslot_date1);
			values.push(req.body.Timeslot_date2);
		}
		if (typeof req.body.Begin_time !== 'undefined') {
			conditions.push('Timeslot.Begin_time = ?');
			values.push(req.body.Begin_time);
		};
		if (typeof req.body.End_time !== 'undefined') {
			conditions.push('Timeslot.End_time = ?');
			values.push(req.body.End_time);
		};
		if (typeof req.body.Exam_route_idExam_route !== 'undefined') {
			conditions.push('Pauta.Exam_route_idExam_route = ?');
			values.push(req.body.Exam_route_idExam_route);
		};
		if (typeof req.body.T_exam_results_idT_exam_results !== 'undefined') {
			conditions.push('Exam.T_exam_results_idT_exam_results IS NOT NULL');
			// values.push(req.body.T_exam_results_idT_exam_results);
		};
		// concateneate query
		conditionsStr=conditions.length ? conditions.join(' AND ') : '1';
		dbHandlers.Qgen_pauta.Qget_search(conditionsStr,values,(err,results)=>{
			if (err){
				console.log(err);
				res.status(500).json({message:"Error getting advance search"});	
			}else{
				res.status(200).json(results);	
			}	
		});	
	};
};

// DELETE request for Pauta
var deletePauta = (req,res,next)=>{
	console.log("Delete Pauta");
	if(req.query.idPauta){
		dbHandlers.Qgen_pauta.Qdelete_byIdPauta(req.query.idPauta, (err,results)=>{
			if(err){
				console.log(err);
				return res.status(500).json({message:"Error deleting Pauta"});
			}else{
				return res.status(200).json({message:"Pauta deleted"});
			}
		});
	}else{
		// missing id for this request
		res.status(400).json({message:"Bad Request."});	
	};
};

// RANDOMIZES
// -------------------------------------------------------------------------------------------
var P_check_array= async(array,element)=>{
	return await new Promise((resolve,reject)=>{
		for (const it of array){
			if (it[0][0]===element){
				resolve(exam,quantity)
			}
		}
	});
};

var Sort_examiner = async(idexam_center,timeslots,date,time,cb)=>{
	// console.log(payments);
	// dbHandlers.Qgen_examiner_qualification.Qget_AvailableExaminer_Qualification(idexam_center,date,time,(err,qualifications)=>{
	// 	if (err || qualifications.length<=0){
	// 		// no examiners available 
	// 	}else{
	// 		for (const cycles of timeslots.length){
	// 			// query soma t (idtimeslots)=> {
	// 				// for counts
	// 			// 	if count=1
	// 			// }


	// 			var arr_count=[];
	// 			for (const it of qualifications){
	// 				if (typeof arr_count !== 'undefined' && arr_count.length > 0) {
 //    					// check if exam type is already in array
	// 					P_check_array(arr_count,it.Exam_type_idExam_type);
	// 					Promise.all(P_check_array)
	//         				.then(()=>{
	// 							resolve();	
	// 						}).catch((err)=>{
	// 			                // log that I have an error, return the entire array;
	// 			                reject(err);
	//         				});
	// 					};
	// 				};
	// 			};	
	// 		};
	// 		// list of available examiners			
	// 		// for (const it of timeslots){
	// 		// }
	// });
	resolve(1);
};

var P_randomize_examiners = async(idexam_center,timeslots,date,time)=>{
	return await new Promise((resolve,reject)=>{
		try{
			Sort_examiner(idexam_center,timeslots,date,time,(examiners)=>{
				if(examiners){
					resolve();
				}else{
					reject();
				};
			});
		}catch (err){
			return reject(err);
		};
	});
};



// var P_patch_examiner = async(values)=>{
// 	return await new Promise((resolve,reject)=>{
// 		try{
// 			dbHandlers.Qgen_exam_type.Qget_byIdExam_type(values.Exam_type_idExam_type,(err,exam_type)=>{
// 				if(err || exam_type.length<=0){
// 					reject(err);
// 				}else{
// 					dbHandlers.Qgen_examiner_qualification.Qget_Active_Examiner_qualification(
// 								values.Exam_center_idExam_center,(err,qualifications)=>{
// 						// console.log(JSON.stringify(qualifications));
// 						if (err || qualifications.length<=0){
// 							// console.log(err);
// 							// res.status(500).send({message:"No examiners available"});
// 							reject(err);	
// 						}else{
// 							var idexaminer = Math.floor(Math.random() * (qualifications.length - 0 ) + 0);
// 							dbHandlers.Qgen_pauta.Qget_byTimeslotPauta(values.idTimeslot,(err,pauta)=>{
// 								if (err){
// 									reject(err);
// 								}else if(pauta.length<=0){
// 									resolve();	
// 								}else{
// 									dbHandlers.Qgen_pauta.Qupdate_Pauta_Examiner_qualifications(
// 											qualifications[idexaminer].idExaminer_qualifications,
// 											pauta[0].Pauta_num,(err,results)=>{
// 										if (err){
// 											reject(err);
// 										}else{
// 											resolve();
// 										};
// 									});
// 								};
// 							});
// 						};
// 					});
// 				};
// 			});
// 		}catch (err){
// 			return reject(err);
// 		};
// 	});
// };

var P_patch_route = async(values)=>{
	return await new Promise((resolve,reject)=>{
		try{
			dbHandlers.Qgen_exam_type.Qget_byIdExam_type(values.Exam_type_idExam_type,(err,exam_type)=>{
				if(err){
					reject(err);
				}else{
					if(exam_type.length<=0){
						resolve();
					}else if(exam_type[0].Has_route=1){
						dbHandlers.Qgen_exam_routes.Qget_AllIdExam_Routes(values.Exam_center_idExam_center,
									(err,routes)=>{
							if(err){
								reject(err);	
							}else if(routes.length<=0){
								resolve();
							}else{
								var idroute = Math.floor(Math.random() * (routes.length - 0 ) + 0);
								dbHandlers.Qgen_pauta.Qget_byTimeslotPauta(values.idTimeslot,(err,pauta)=>{
									if (err){
										reject(err);
									}else if(pauta.length<=0){
										resolve();	
									}else{
										dbHandlers.Qgen_pauta.Qupdate_Pauta_route(routes[idroute].idExam_route,
												pauta[0].Pauta_num,(err,results)=>{
											if (err){
												reject(err);
											}else{
												resolve();
											};
										});
									};
								});
							};
						});
					}else{
						resolve();
					};
				};
			});
		}catch (err){
			return reject(err);
		};
	});
};

// check exams balance of a given school for theorical free exams
var Check_balance = async (idbooking,idexam_type,exam_price,cb)=>{

	dbHandlers.Qgen_booked.Qget_byIdBooking(idbooking,(e,book)=>{
		// book.Exam_center_idExam_center
		if (e){
			cb(false);
		}else{
			dbHandlers.Qgen_exam_type.Qget_byIdExam_type(idexam_type,(e,exam_type)=>{
				if (e){
					cb(false);
				}else{
					if (exam_type[0].Code==="TM"){
						dbHandlers.Qgen_balance.Qget_BySchoolBalances(book[0].School_idSchool,(e,balance)=>{
							if(e){
								cb(false);
							}else if(balance.length===0){
								dbHandlers.Qgen_balance.Qcreate_Balances(book[0].School_idSchool,(e,newbalance)=>{
									if(e){
										cb(false);	
									}else{
										cb(true);
									};
								});
							}else{
								if (balance[0].Balance_count=config.special_offers.TM_exams){
									dbHandlers.Qgen_balance.Qpatch_Balances(0,balance[0].idBalance,(e,reset)=>{
										if(e){
											cb(false);	
										}else{
											// TODO CREATE TRANSACTION WITH SPECIAL OFFER
											
										};
									});
								}else if (balance[0].Balance_count<config.special_offers.TM_exams){
									dbHandlers.Qgen_balance.Qpatch_Balances((balance[0].Balance_count+1),balance[0].idBalance,(e,result)=>{
										if(e){
											cb(false);	
										}else{
											cb(true);
										};	
									});
								}else{
									cb(true);	
								};
							};
						});	
					}else{
						cb(true);
					};
				};
			});
		};	
	});

		




};

// -------------------------------------------------------------------------------------------
// promise to create exams
var P_create_exams = async(values) => {
	return await new Promise((resolve,reject)=>{
		try{
			dbHandlers.Qgen_exam.Qcreate_Exam([values.Booked_idBooked,values.Account_idAccount,
							values.Pauta_idPauta],async (err,exam)=>{
				if(err){
					reject(err);
				}else{
					dbHandlers.Qgen_exam_price.Qget_price_tax_emit(values.Exam_type_idExam_type,async (err,price)=>{
						if(err){
							reject(err);
						}else{
							dbHandlers.Qgen_pendent_payments.Qcreate_PendentPayment_tax(price.Value,
									values.Booked_idBooked,values.Student_license_idStudent_license,
									async (err,tax) => {
								if(err){
									reject(err);
								}else{
									// CONTROL EXTRA EXAMS FOR THEORIC
									Check_balance(values.Booked_idBooked,values.Exam_type_idExam_type,(cb)=>{
										if (cb=true){
											resolve();
										}else{
											reject();	
										};
									});
								};
							});
						};
					});
				};
			});	
		}catch (err){
			return reject(err);
		};
	});
};

// Promise get bookings for given timeslot 
var P_get_bookings = async (idTimeslot) => {
	return await new Promise((resolve,reject)=>{
		try{
			// console.log("timeslot id "+ idTimeslot);
			dbHandlers.Qgen_booked.Qget_ValuesCreateExam(idTimeslot,(err,bookings)=>{
				if (err){
					reject(err);
				}else{
					// For each booking create an exam
	  				if (bookings.length>0) {
		  				// need to get values per booking for respective timeslot
		  				var arr_create_exams=[];
		  				// console.log("start creating exams " + JSON.stringify(bookings))
						bookings.forEach((element)=>{
							// concatenate booking with account user logged in
							var values = {};
							_.assign(values, element, {'Account_idAccount': 1});
							arr_create_exams.push(P_create_exams(values));
						});
						Promise.all(arr_create_exams)
	        				.then(()=>{
								resolve();	
							}).catch((err)=> {
				                // log that I have an error, return the entire array;
				                reject(err);
	        				});	
	  				}else{
	  					resolve();
	  				};
				};
	  		});		
		}catch (err){
			return reject(err);
		};
	});
};

// Promise get bookings for given timeslot 
var P_number_exams = async (idexam,number)=>{
	return await new Promise((resolve,reject)=>{
		try{
			// console.log("number exam")
			dbHandlers.Qgen_exam.Qupdate_ExamNumber(idexam,number,(err,results)=>{
				if (err){
					reject(err);
				}else{
					resolve();
				};
			});
		}catch (err){
			return reject(err);
		};
	});
};

// UPDATE request for Pauta
var updatePauta = async (req,res,next)=>{
	console.log("Update pauta");
	if(req.query.idPauta){
		// force examiner
		if (req.body.F_reason && req.body.idExaminer){
			// forced examiner
			dbHandlers.Qgen_pauta.Qget_byIdPauta(req.query.idPauta,(err,results)=>{
				if (err){
					console.log(err);
					return res.status(500).json({message:"Error getting Pauta"});	
				}else{
					if(results[0].Exam_type_idExam_type){
						dbHandlers.Qgen_examiner_qualification.Qget_Examiner_qualification(req.body.idExaminer,
									results[0].Exam_type_idExam_type,(err,results)=>{
							if(err){
								console.log(err);
								return res.status(500).json({message:"Error getting Examiner Qualifications"});		
							}else if(results.length<=0){
								return res.status(500).json({message:"Error Examiner Qualifications not found"});		
							}else{
								dbHandlers.Qgen_pauta.Qupdate_Force_Examiner(req.query.idPauta,req.body.F_reason,
											results[0].idExaminer_qualifications,(err,results)=>{
									if(err){
										console.log(err);
										return res.status(500).json({message:"Error updating Pauta"});
									}else{
										return res.status(200).json({message:"Examiner changed successfully"});		
									};					
								});
							};
						});
					}else{
						res.status(500).json({message:"Error on Pauta"});	
					}
				};
			});
		// modify given pauta
		}else if(req.body.Pauta_num||req.body.Exam_date||req.body.Pauta_date||req.body.Inital_hour||req.body.Final_hour||
					req.body.Exam_route_idExam_route||req.body.Exam_type_idExam_type){
			// normal update to table
			dbHandlers.Qgen_pauta.Qupdate_byIdPauta(req.query.idPauta,[req.body.Pauta_num,req.body.Exam_date,
						req.body.Pauta_date,req.body.Inital_hour,req.body.Final_hour,
						req.body.Exam_route_idExam_route,req.body.Exam_type_idExam_type],(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error updating Pauta"});
				}else{
					return res.status(200).json({message:"Pauta updated."});		
				};
			});
		};
	// randomize examiner and route for starting timeslots
	}else if(req.query.start && req.body.Exam_center_idExam_center){
		// get server time plus time_window.minutes
		let time_now=moment().add(config.time_window.minutes,'m').format("H:mm:ss");
		let date_now=moment().format("YYYY-MM-DD");
		// get next timeslots
		dbHandlers.Qgen_timeslot.Qget_nextTimeslot(req.body.Exam_center_idExam_center,date_now.toString(),
						time_now,(err,timeslots)=>{			
			if (err){
				console.log(err);
				res.status(500).json({message:"Error getting timeslots"});	
			}else if (timeslots.length<=0){
				res.status(204).json({message:"No timeslots found"});		
			}else{
				// -----------------------------------------------------
				// Randomize examiners for given timeslots
				P_randomize_examiners(req.body.Exam_center_idExam_center,timeslots,date_now,time_now);
				Promise.all(P_randomize_examiners)
					.then(()=>{
    					// everything went ok
					}).catch((err)=>{
	                // log that I have an error, return the entire array;
		                console.log(err);
		                return res.status(500).json({message:"Database error randomizing examiners"});
    				});
				// -----------------------------------------------------
				// var arr_examiner=[];
				// timeslots.forEach((element)=>{
				// 	arr_examiner.push(P_patch_examiner(element));
				// });
				// Promise.all(arr_examiner)
			    // 				.then(()=>{
			    // 					// everything went ok
				// 	}).catch((err)=>{
	   			//              // log that I have an error, return the entire array;
			    //               console.log(err);
			    //               return res.status(500).json({message:"Database error randomizing examiners"});
    			// 				});
				// -----------------------------------------------------
				// Randomize routes for given timeslots
				var arr_routes=[];
				timeslots.forEach((element)=>{
					arr_routes.push(P_patch_route(element));	
				});
				Promise.all(arr_routes)
    				.then(()=>{
    					// everything went ok
					}).catch((err)=>{
	                // log that I have an error, return the entire array;
		                console.log(err);
		                return res.status(500).json({message:"Database error randomizing routes"});
    				});
				// -----------------------------------------------------
				var arr_start_exams=[];
				timeslots.forEach((element)=>{
					arr_start_exams.push(P_get_bookings(element.idTimeslot));	
				});	
				Promise.all(arr_start_exams)
    				.then(()=>{
    					// Need to assign numbers to exams
    					dbHandlers.Qgen_exam.Qget_not_numbered_exams(req.body.Exam_center_idExam_center,(err,exams)=>{
    						if (err || exams.length<=0){
    							console.log(err);
    							return res.status(500).json({message:"Database error allocating examiners"});	
    						}else{
    							// temp numeration to put in all exams missing it
    							var temp_numeration=0;
    							dbHandlers.Qgen_exam.Qget_MAXExamNum(req.body.Exam_center_idExam_center,(err,number)=>{
    								if (err){
    									console.log(err);
    									return res.status(500).json({message:"Database error numbering exams"});	
    								}else if(number[0].Exam_num===null){
    									var temp_numeration=0;
    								}else{
    									var temp_numeration=number[0].Exam_num;	
    								};
    								var arr_number_exams=[];
									exams.forEach((element)=>{
										temp_numeration=temp_numeration+1
										arr_number_exams.push(P_number_exams(element.idExam,temp_numeration));	
									});
									Promise.all(arr_number_exams)
										.then(()=>{
											res.status(200).json({message:"Examiners defined and Exams created"});		
										}).catch((err)=>{
							                // log that I have an error, return the entire array;
							                console.log(err);
							                return res.status(500).json({message:"Database error allocating examiners"});
				        				});
    							});	
    						};
    					});
					}).catch((err)=>{
		                // log that I have an error, return the entire array;
		                console.log(err);
		                return res.status(500).json({message:"Database error allocating examiners"});
    				});			
			};
		});
	}else{
		// missing id for this request
		return res.status(400).json({message:"Bad Request."});	
	};
};

module.exports = {
	getList_Pauta_Exam_Center,
	createPauta,
	deletePauta,
	updatePauta
}

// function P_get_exams(timeslots,cb){
// 	var arr_exams = [];
// 	timeslots.foreach((element)=>{
// 		console.log(timeslots[element]);
// 		dbHandlers.Qgen_examiner_qualification.Qget_Active_Examiner_qualification(
// 					req.body.Exam_center_idExam_center,(err,qualifications)=>{
// 			if (err || qualifications.length<=0){
// 				console.log(err);
// 				res.status(500).send({message:"No examiners available"});	
// 			}else{
// 				console.log(qualifications);
// 			}
// 		});
// 	});
// };