var config=require('../config.json');
var dbHandlers = require("../db");
var moment = require('moment');
var _=require('lodash');
var hash = require("hashmap");

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
					res.status(204).json({message:"No results"});	
				}else{
					res.status(200).json(results);
				};
			});
		}else if (req.query.Pauta_num){
			//get pauta by number
			dbHandlers.Qgen_pauta.Qget_byNumPauta(req.query.Pauta_num,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting Pautas"});
				}else if(results.length<=0){
					res.status(204).json({message:"No results"});	
				}else{
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
				res.status(200).json(results);
			};
		});
	};
};

// function to pass parameters to promise
var P_create_pauta= async (values) => {
	return await new Promise((resolve,reject)=>{
		try{
			dbHandlers.Qgen_pauta.Qcreate_Pauta(values,(err,results)=>{
				if (err){
					console.log(err);
					reject(err);
				}else{
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
			dbHandlers.Qgen_accounts.Qget_byUserAccount(req.user.user,(e,account)=>{
				if(e){
					console.log(e);
					return res.status(500).send({message:"Database error identifying account"});
				}else{
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
										array_P_pautas.push(P_create_pauta([temp_pauta_num,element.idTimeslot,account.idAccount,
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
				};
			});
		}else{
			// missing id for this request
			return res.status(400).send({message:"Bad Request."});	
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

// Update Exam Results
var P_exam_result = async (element)=>{
	return await new Promise ((resolve,reject)=>{
		dbHandlers.Qgen_exam.Qupdate_Exam_result(element.idExam,element.T_exam_results_idT_exam_results,(e,result)=>{
			if(e){
				reject();
			}else{
				resolve();
			};
		});
	});
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

function randomize(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
};

var P_randomize_examiners = async (idexam_center) => {
	return await new Promise((resolve, reject) => {
    	try {
	    	var date_now = moment().format("YYYY-MM-DD").toString();
	    	// console.log("DATE NOW" + date_now);
	    	var time_now = moment().add(config.time_window.minutes, "m").format("H:mm:ss");
	      	// console.log("TIME NOW" + time_now);

	      	dbHandlers.Qgen_timeslot.Qget_countTimeslot(idexam_center,date_now,time_now,(err, timeslots) => {
	         	if (err) {
	            	console.log(err);
	            	reject(err);
	            	// return res.status(500).json({ message: "Error getting timeslots" });
	          	} else if (timeslots.length <= 0) {
	          		console.log("No timeslots found");
	          		reject();
	            	// return res.status(204).json({ message: "No timeslots found" });
	          	} else {
	            	dbHandlers.Qgen_examiner_qualification.Qget_AvailableExaminer_Qualification(idexam_center,date_now,time_now,
	            						(error, availableExaminers) => {
	                	if (error) {
	                  		console.log(error);
	                  		reject(error);
	                  		// res.status(500).json({ message: "Error getting examiners" });
	                	} else if (availableExaminers.length <= 0) {
	                  		// res.status(204).json({ message: "No examiners found" });
	                	} else {
	                  		var examinersMap = new hash();
	                  		for (let i = 0; i < timeslots.length; i++) {
	                    		if (timeslots[i].numero == 1) {
	                      			examinersMap.set(timeslots[i].idtimeslot,timeslots[i].Examiner_idExaminer);
	                    		} else {
	                      			var examinersList = new Array();
	                      			for (let j = 0; j < availableExaminers.length; j++) {
	                        			if (!examinersMap.has(availableExaminers[j].idtimeslot) &&
	                          					examinersMap.search(availableExaminers[j].Examiner_idExaminer) == null) {
	                        				if (availableExaminers[j].idtimeslot == timeslots[i].idtimeslot) {
	                            				examinersList.push(availableExaminers[j].Examiner_idExaminer);
	                          				};
	                        			};
	                      			};
	                      			examinersMap.set(timeslots[i].idtimeslot,randomize(examinersList));
	                    		};
	                  		};
                  			resolve(examinersMap.entries());
                  			// console.log(JSON.stringify(examinersMap.entries()));
                  			// res.status(200).json({message:" Examiners Sorted " + JSON.stringify(examinersMap.entries())});
	                	};
	              	});
	          	};
	        });
	    } catch (err) {
	    	return reject(err);
	    };
  	});
};

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
var Check_balance = async (idbooking,idexam_type,cb)=>{
	dbHandlers.Qgen_booked.Qget_byIdBooking(idbooking,(e,book)=>{
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
											dbHandlers.Qgen_payment_method.Qget_SpecialOfferIDPaymentMethod((e,id_offer)=>{
												if(e){
													cb(false);		
												}else{
													let today_date=moment().format('YYYY-MM-DD');
													dbHandlers.Qgen_transactions.Qcreate_Transactions(null,exam_type[0].Price,
																today_date,book[0].Exam_center_idExam_center,book[0].idSchool,
																id_offer[0].idPayment_method,null,null,(e)=>{
														if(e){
															cb(false);
														}else{
															cb(true);
														}
													});
												};
											});
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
			// check if car plate already exists
			dbHandlers.Qgen_reservations.Qget_byIdbooked_car_plate(values.Booked_idBooked,(e,licenseplate)=>{
				if(e){
					reject(e);
				}else{
					dbHandlers.Qgen_exam.Qcreate_Exam([values.Booked_idBooked,values.Account_idAccount,
									values.Pauta_idPauta,licenseplate.car_plate],async (err,exam)=>{
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
				};
			});
		}catch (err){
			return reject(err);
		};
	});
};

// Promise get bookings for given timeslot 
var P_get_bookings = async (idTimeslot,idaccount) => {
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
							_.assign(values, element, {'Account_idAccount': idaccount});
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
						dbHandlers.Qgen_examiner_qualification.Qget_IdExaminer_qualification(req.body.idExaminer,
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
		}else if(req.body.Pauta_num||req.body.Exam_date||req.body.Pauta_date||req.body.Exam_route_idExam_route||req.body.Exam_type_idExam_type){
			// normal update to table
			dbHandlers.Qgen_pauta.Qupdate_byIdPauta(req.query.idPauta,_.pick(req.body, ['Pauta_num','Pauta_date','F_reason',
							'Timeslot_idTimeslot','Account_idAccount','Exam_type_idExam_type','Exam_route_idExam_route',
							'Examiner_qualifications_idExaminer_qualifications']),(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error updating Pauta"});
				}else{
					return res.status(200).json({message:"Pauta updated."});		
				};
			});
		// update results for given pauta
		}else if(req.query.Result){
			console.log(req.body);
			if (req.body.results.length>0){
				// console.log("USER "+ req.user.user);
				let arr_patch_results=[];
				req.body.results.forEach((element)=>{
							arr_patch_results.push(P_exam_result(element));
						});
						Promise.all(arr_patch_results)
	        				.then(()=>{
								return res.status(200).json({message:"Results updated in pauta."});
							}).catch((err)=> {
				                // log that I have an error, return the entire array;
				                console.log(err);
				                return res.status(500).json({message:"Database error updating results in pauta."});
	        				});	

			}else{
				return res.status(204).json({message:"No content"});	
			};
		};
	// randomize examiner and route for starting timeslots
	}else if(req.query.start && req.body.Exam_center_idExam_center){
		// get server time plus time_window.minutes
		let time_now=moment().add(config.time_window.minutes,'m').format("H:mm:ss");
		let date_now=moment().format("YYYY-MM-DD");

		console.log("Search time "+ date_now +" with "+time_now);
		// get next timeslots
		dbHandlers.Qgen_timeslot.Qget_nextTimeslot(req.body.Exam_center_idExam_center,date_now.toString(),
						time_now, (err,timeslots)=>{			
			if (err){
				console.log(err);
				res.status(500).json({message:"Error getting timeslots"});	
			}else if (timeslots.length<=0){
				res.status(204).json({message:"No timeslots found"});		
			}else{
				dbHandlers.Qgen_accounts.Qget_byUserAccount(req.user.user, async (e,account)=>{
					if(e){
						console.log(e);
						return res.status(500).json({message:"Database error identifiyng user"});
					}else{
						// -----------------------------------------------------
						// Randomize examiners for given timeslots
						var examiners = await P_randomize_examiners(req.body.Exam_center_idExam_center);
											// Promise.all(P_randomize_examiners)
											// 	.then(()=>{
										    // // everything went ok
														// 	}).catch((err)=>{
											   //              // log that I have an error, return the entire array;
												  //               console.log(err);
												  //               return res.status(500).json({message:"Database error randomizing examiners"});
										    // 				});
						console.log("--------------------------------------------");
						console.log("OS EXAMINADORES " + JSON.stringify(examiners));
						console.log("OS EXAMINADORES " + JSON.stringify(examiners.length));
						console.log("OS EXAMINADORES " + JSON.stringify(examiners[0][0]));
						console.log("OS EXAMINADORES " + JSON.stringify(examiners[0][1]));
						console.log("--------------------------------------------");
						for (let i = 0; i < examiners.length; i++) {
							dbHandlers.Qgen_pauta.Qupdate_Pauta_examiner(examiners[1],examiners[i],(e)=>{
								if(e){
									console.log("Database error writing examiners");
								};
							});
						};
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
							arr_start_exams.push(P_get_bookings(element.idTimeslot,account.idAccount));	
						});	
						Promise.all(arr_start_exams)
		    				.then(()=>{
		    					// Need to assign numbers to exams
		    					dbHandlers.Qgen_exam.Qget_not_numbered_exams(req.body.Exam_center_idExam_center,(err,exams)=>{
		    						console.log(exams)
		    						if (err || exams.length<=0){
		    							console.log(err);
		    							return res.status(500).json({message:"Database error fetching exams to number"});	
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