var dbHandlers = require("../db");
var Temp_Student_Schema = require('../db/schemas/schema_temp_student.json');
var validator = require('node-input-validator');
var _ = require('lodash');
var ctl_student_license = require("./ctl_student_license");
var config=require('../config.json');
var nodemailer = require('nodemailer');
var request=require('request');
var moment=require('moment');
var multer = require('multer');

// Request handlers
var getList_ReservationsByIdTimeslot = async (req, res)=>{
	if (req.params.idExam_center>0){
		if (req.query.idTimeslot) {
			dbHandlers.Qgen_reservations.Qdelete_lockedExpiredReservationsByIdTimeslot(req.query.idTimeslot, new Date(), (error) => { 
				// Deletes expired reservations
				if (error) {
					return res.status(500).json({message: 'There was an error while trying to delete expired reservations.'});
				}else{
					dbHandlers.Qgen_reservations.Qget_reservationsDetailedByTimeslot(req.query.idTimeslot, req.params.idExam_center, (error, resResults) => { 
						// Gets reservations by timeslot
						if (error) {
							return res.status(500).json({message: 'There was an error while trying to fetch reservations.'});
						}else if (resResults.length === 0) {
							return res.status(204).json({message: 'No reservations found. Timeslot is empty.'});
						}else{
							return res.status(200).json(resResults);
						};
					});
				};
			});	
		}else if(req.query.status){
			dbHandlers.Qgen_reservations.Qget_byStatusReservations(req.query.status,req.params.idExam_center,(err,reservations)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message: 'Database error fetching reservations by status'});	
				}else if(reservations.length === 0) {
					return res.status(204).json({message: 'No reservations found.'});
				}else{
					return res.status(200).json(reservations);
				};
			});
		}else if(req.query.permit){
			dbHandlers.Qgen_reservations.Qget_byPermitReservations(req.query.permit,req.params.idExam_center,(err,reservations)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message: 'Database error fetching reservations by permit'});		
				}else if(reservations.length === 0) {
					return res.status(204).json({message: 'No reservations found.'});
				}else{
					return res.status(200).json(reservations);
				};
			});
		}else if(req.query.date){
			dbHandlers.Qgen_reservations.Qget_byDateReservations(req.query.date,req.params.idExam_center,(err,reservations)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message: 'Database error fetching reservations by date'});		
				}else if(reservations.length === 0) {
					return res.status(204).json({message: 'No reservations found.'});
				}else{
					return res.status(200).json(reservations);
				};
			});
		}else if(req.query.name){
			dbHandlers.Qgen_reservations.Qget_byStudentNameReservations(req.query.name,req.params.idExam_center,(err,reservations)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message: 'Database error fetching reservations by student name'});	
				}else if(reservations.length === 0) {
					return res.status(204).json({message: 'No reservations found.'});
				}else{
					return res.status(200).json(reservations);
				};
			});
		}else if(req.query.id_num){
			dbHandlers.Qgen_reservations.Qget_byIDnumReservations(req.query.id_num,req.params.idExam_center,(err,reservations)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message: 'Database error fetching reservations by student identification'});		
				}else if(reservations.length === 0) {
					return res.status(204).json({message: 'No reservations found.'});
				}else{
					return res.status(200).json(reservations);
				};
			});
		}else if(req.query.tax_num){
			dbHandlers.Qgen_reservations.Qget_byTaxnumReservations(req.query.tax_num,req.params.idExam_center,(err,reservations)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message: 'Database error fetching reservations by student tax number'});		
				}else if(reservations.length === 0) {
					return res.status(204).json({message: 'No reservations found.'});
				}else{
					return res.status(200).json(reservations);
				};
			});
		}else if(req.query.paid){
			if (req.query.idReservation){
				dbHandlers.Qgen_reservations.Qget_byIdPaidPendingReservations(req.params.idExam_center,(err,reservations)=>{
					if(err){
						console.log(err);
						return res.status(500).json({message: 'Database error fetching pendent paid reservations'});	
					}else if(reservations.length === 0) {
						return res.status(204).json({message:"Invalid reseration"});
					}else{
						// TODO change reservation status to marcado
						return res.status(200).json({message:"Reservation validated"});
					};
				});
			}else{
				dbHandlers.Qgen_reservations.Qget_PaidPendingReservations(req.params.idExam_center,(err,reservations)=>{
					if(err){
						console.log(err);
						return res.status(500).json({message: 'Database error fetching pendent paid reservations'});	
					}else if(reservations.length === 0) {
						return res.status(204).json({message: 'No reservations found.'});
					}else{
						return res.status(200).json(reservations);
					};
				});
			};
		}else if (req.query.idReservation){
			dbHandlers.Qgen_reservations.Qget_byIdReservation(req.query.idReservation,(err,reservations)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message: 'Database error fetching reservation by id'});	
				}else if(reservations.length === 0) {
					return res.status(204).json({message: 'No reservations found.'});
				}else{
					return res.status(200).json(reservations);
				};
			});
		}else if (req.query.schedule){
			dbHandlers.Qgen_reservations.Qget_AllReservationsforSchedule(req.params.idExam_center,(err, reservations)=>{
				if (err) {
					console.log(err);
					return res.status(500).json({message: 'Error fetching reservations.'});
				}else if (reservations.length === 0) {
					return res.status(204).json({message: 'No reservations found.'});
				}else{
					return res.status(200).json(reservations);
				};	
			});		
		}else{
			dbHandlers.Qgen_reservations.Qget_AllPendentReservations(req.params.idExam_center,(err, reservations)=>{
				if (err) {
					console.log(err);
					return res.status(500).json({message: 'Error fetching reservations.'});
				}else if (reservations.length === 0) {
					return res.status(204).json({message: 'No reservations found.'});
				}else{
					return res.status(200).json(reservations);
				};	
			});
		};
	}else{
		return res.status(400).json({message:'Bad request'});	
	};
};

var postList_Reservations=async(req,res)=>{
	if(req.query.idReservation && req.query.file){
		// var fs = require('fs');

		// fs.stat(config.files.reservations_model2+'/2019', function(err) {
		//     if (!err) {
		//         console.log('file or directory exists');
		//     }
		//     else if (err.code === 'ENOENT') {
		//         console.log('file or directory does not exist');
		//     }
		// });
		// define multer storage 
		var storage= multer.diskStorage({
	       	destination: function (req, file, cb) {
	   			cb(null, config.files.reservations_model2);
	 		},
 			filename: function (req, file, cb) {
	   			cb(null, file.originalname);
 			}
		});
		var upload = multer({ storage:storage }).single('file');
		// upload reservations file to config directory
	    upload(req, res, (err)=> {
	        if (err instanceof multer.MulterError) {
	            console.log(err.message);
	            return res.status(406).json({message:"Bad format file"});
	        } else if (err) {
	            console.log(err.message);
	            return res.status(400).json({message:"Bad request"})
	        }
	        return res.status(200).json({message:"Reservation file saved"});
	    });
	}else if (!req.query.search){
		// Deletes expired and locked reservations
		await new Promise((resolve) => {
			dbHandlers.Qgen_reservations.Qdelete_lockedExpiredReservationsByIdTimeslot(req.body.idTimeslot,new Date(),(error)=>{ 
				if (error) {
					console.log(error);
					return res.status(500).json({message: 'There was an error while trying to delete expired reservations.'});
				}else{
					resolve();	
				};
			});
		});
		// Block reservations
		if (req.query.block === 'true') { 
			if (!req.body.Block_number || (req.body.Block_number !== 2 && req.body.Block_number !== 1)) {
				return res.status(400).json({message:"Bad request"});
			}
			dbHandlers.Qgen_exam_status.Qget_byProcessCancelID(0,(error,idcancel)=>{
				if (error) {
					console.log(error);
					reject(error);
				}else{
					// Gets timeslot
					dbHandlers.Qgen_timeslot.Qget_timeslotById(idcancel[0].idexam_status,
							req.body.idTimeslot, req.params.idExam_center,async(error, timeslot)=>{
						if (error) {
							console.log(error);
							return res.status(500).json({message: 'There was an error while trying to get information about the timeslot.'});
						}
						if (timeslot.length === 0) {
							return res.status(400).json({message: 'Timeslot not found.'});
						}
						// It is possible to add reservations
						if (timeslot[0].number_Reservations + req.body.Block_number <= timeslot[0].Max_Num_Students) {
							dbHandlers.Qgen_exam_status.Qget_byProcessReservationID(0,(err,idpending)=>{
								if(err){
									console.log(err);
									return res.status(500).json({message: 'Database error fetching reservation pending id'});
								}else{
									if (req.body.Block_number === 1) {
										// Adds reservation
										// Locked reservation will expire in 1 hour
										dbHandlers.Qgen_reservations.Qpost_reservations([ 
											req.body.idTimeslot,
											req.user.user,
											new Date(new Date().getTime() + (config.reservation.block_time*60000)), 
											timeslot[0].Exam_type_idExam_type,
											idpending[0].idexam_status
										], (error,blocked) => { // Add reservations
											if (error) {
												console.log(error);
												return res.status(500).json({message: 'There was as error while trying to block reservations.'});
											}else{
												return res.status(200).json(blocked);
											};
										});
									};
									if (req.body.Block_number === 2) {
										dbHandlers.Qgen_reservations.Qpost_pairReservations([ // Adds reservation
											req.body.idTimeslot,
											req.user.user,
											new Date(new Date().getTime() + (config.reservation.block_time*60000)),
											timeslot[0].Exam_type_idExam_type,
											idpending[0].idexam_status
										], (error,blocked) => { // Add reservations
											if (error) {
												console.log(error);
												return res.status(500).json({message: 'There was as error while trying to block reservations.'});
											}else{
												return res.status(200).json(blocked);	
											};
										});
									};
								};
							});
						}else{
							return res.status(400).json({message: 'It isn\'t possible to add more students to this slot. Limit has been reached.'});
						};
					});
				};
			});
		}else{ // Add reservations
			// if (!req.body.tax_num || !req.body.Exam_type_idExam_type) {
			// 	return res.status(400).json({message:"Bad request"});
			// };
			// let sVal = new validator(req.body, Temp_Student_Schema)
			// let matched = await sVal.check();
			// if (!matched) {
			// 	console.log(sVal.errors);
			// 	
			// };
			if (!req.body.idTimeslot){
				return res.status(400).json({message:"Bad request"});
			}
			// Gets locked reservations
			dbHandlers.Qgen_reservations.Qget_lockedReservationsByTimeslotAndUser(req.body.idTimeslot, 
					req.params.idExam_center,req.user.user,(error, reservations) => { 
				if (error) {
					console.log(error);
					return res.status(500).json({message: 'There was an error while trying to fetch locked reservations.'});
				};
				if (reservations.length === 0) {
					return res.status(400).json({message: 'There aren\'t blocked reservations to edit.'});
				};
				console.log("--------------------------------------------------- ");
				console.log("RESERVATION DATA " + JSON.stringify(req.body));
				console.log("--------------------------------------------------- ");
				dbHandlers.Qgen_reservations.Qpatch_reservation({ // Edits the reservation (Turns it into a real reservation)
					Exam_type_idExam_type: req.body.Exam_type_idExam_type,
					Lock_expiration_date: null,
					Car_plate: req.body.Car_plate
				}, reservations[0].idReservation, (error) => { // Unlocks reservation
					if (error) {
						console.log(error);
						return res.status(500).json({message: 'There was an error while trying to update the reservation.'});
					};
					dbHandlers.Qgen_temp_student.Qpost_temp_Student([req.body.Student_name,req.body.Student_num,req.body.Birth_date,req.body.ID_num,
								req.body.ID_expire_date, req.body.tax_num, req.body.Drive_license_num, req.body.Obs,
								req.body.School_Permit,req.body.Student_license,req.body.Expiration_date,req.body.exam_expiration_date,
								reservations[0].idReservation,req.body.Type_category_idType_category,req.body.T_ID_type_idT_ID_type],
								(error)=>{ // Adds a temporary student
						if (error) {
							console.log(error);
							return res.status(500).json({message: 'There was an error while trying to update the student.'});
						}else{
							dbHandlers.Qgen_exam_price.Qget_price_associated(reservations[0].Exam_type_idExam_type,(err, price) => {
								if (err || price.length <= 0) {
									return res.status(500).json({ message: "Error getting exam price" });
								} else {
									dbHandlers.Qgen_pendent_payments.Qcreate_PendentPayment_reservation(price[0].Value, reservations[0].idReservation, 
													(err, results) => {
										if (err) {
											console.log(err);
											return res.status(500).json({ message: "Error creating pendent payment" });
										} else {
											return res.status(200).json({message:'Reservation added.'});
										};
									});
								};
							});
						};
					});
				});
			});
		};
	}else{
		var conditions = ['Timeslot.Exam_center_idExam_center = ?'];
		var values = [req.params.idExam_center];
		var conditionsStr;

		if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 === 'undefined') {
			conditions.push('Timeslot.Timeslot_date = ?');
			values.push(req.body.Timeslot_date1);
		}else if(typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined'){
			conditions.push('Timeslot.Timeslot_date BETWEEN ? AND ?');
			values.push(req.body.Timeslot_date1);
			values.push(req.body.Timeslot_date2);
		}else if(typeof req.body.Timeslot_date1 === 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined'){
			conditions.push('Timeslot.Timeslot_date = ?');
			values.push(req.body.Timeslot_date2);
		};
		if (typeof req.body.Exam_type_idExam_type !== 'undefined') {
			conditions.push('Reservation.Exam_type_idExam_type = ?');
			values.push(req.body.Exam_type_idExam_type);
		};
		if (typeof req.body.T_exam_status_idexam_status !== 'undefined') {
			conditions.push('Reservation.T_exam_status_idexam_status = ?');
			values.push(req.body.T_exam_status_idexam_status);
		};
		if (typeof req.body.Student_name !== 'undefined') {
			conditions.push('Temp_Student.Student_name LIKE ?');
			values.push("%"+req.body.Student_name+"%");
		};
		if (typeof req.body.ID_num !== 'undefined') {
			conditions.push('Temp_Student.ID_num = ?');
			values.push(req.body.ID_num);
		};
		if (typeof req.body.Tax_num !== 'undefined') {
			conditions.push('Temp_Student.Tax_num = ?');
			values.push(req.body.Tax_num);
		};
		if (typeof req.body.School_Permit !== 'undefined') {
			conditions.push('Temp_Student.School_Permit = ?');
			values.push(req.body.School_Permit);
		};
		if (typeof req.body.Student_license !== 'undefined') {
			conditions.push('Temp_Student.Student_license = ?');
			values.push(req.body.Student_license);
		};
		// concateneate query
		conditionsStr=conditions.length ? conditions.join(' AND ') : '1';
		dbHandlers.Qgen_reservations.Qget_search(conditionsStr,values,(err,results)=>{
			if (err){
				console.log(err);
				res.status(500).json({message:"Error getting advance search"});	
			}else{
				res.status(200).json(results);	
			}	
		});	
	};
};

// Deletes a reservation and its temporary student
var deleteList_reservations = (req, res) => {
	if (req.query.idReservation){
		dbHandlers.Qgen_reservations.Qdelete_reservationsById(req.query.idReservation, 
					req.params.idExam_center, (error) => { 
			if (error) {
				console.log(error);
				return res.status(500).json({message: 'Error trying to delete the reservation.'});
			}else{
				return res.status(200).json({message: 'Reservation deleted successfully.'});	
			};
		});
	}else{
		return res.status(400).json({message: 'Bad request'});
	};
};

// Update the reservation
var patchList_Reservations=async(req,res,next)=>{
	if (req.query.idReservation) {
		if(!req.query.cancel){
			// var response_flag=false;
			if (req.body.Exam_type_idExam_type || req.body.T_exam_status_idexam_status){
				dbHandlers.Qgen_reservations.Qpatch_reservation(_.pick(req.body, ['Exam_type_idExam_type', 'T_exam_status_idexam_status']),
							req.query.idReservation,(error) => { // Modifies the locked reservation
					if (error) {
						console.log(error);
						// response_flag=false;
						return res.status(500).json({message:'Error updating the reservation.'});
					}else{
						if (req.query.idTemp_Student) { // Update the temporary student
							console.log("--------PATCH RESERVA " + JSON.stringify(req.body));
							dbHandlers.Qgen_temp_student.Qpatch_Temp_Student(_.pick(req.body, [
										'T_ID_Type', 'Student_name', 'Birth_date', 'ID_num', 'ID_expire_date', 'tax_num', 'Drive_license_num','Obs',
										'School_Permit', 'idType_category', 'Student_license', 'Student_license_Expiration_date','Student_num',
										'exam_expiration_date']),req.query.idTemp_Student, (error) => { // Modifies the student
								if (error) {
									console.log(error);
									return res.status(500).json({message: 'Error trying to update the reservation student.'});
								}else{
									return res.status(200).json({message: 'Reservation updated.'});
								};
							});		
						}else{
							return res.status(200).json({message: 'Reservation updated.'});
						};
					};
				});
			}else if (req.query.idTemp_Student) { // Update the temporary student
				dbHandlers.Qgen_temp_student.Qpatch_Temp_Student(_.pick(req.body, [
							'T_ID_Type', 'Student_name', 'Birth_date', 'ID_num', 'ID_expire_date', 'tax_num', 'Drive_license_num','Obs','School_Permit', 
							'idType_category', 'Student_license', 'Student_license_Expiration_date','Student_num','exam_expiration_date']), 
							req.query.idTemp_Student, (error) => { // Modifies the student
					if (error) {
						console.log(error);
						return res.status(500).json({message: 'Error trying to update the rewsrevation student.'});
					}else{
						return res.status(200).json({message: 'Reservation updated.'});
					};
				});
			}else if (req.query.aprove){
				dbHandlers.Qgen_exam_status.Qget_byProcessPendentID(0,(err,idpending)=>{
					if(err){
						console.log(err);
						return res.status(500).json({message: 'Database error fetching reservation pending id'});
					}else{
						dbHandlers.Qgen_reservations.Qpatch_Pendentreservation(idpending[0].idexam_status,req.query.idReservation,(err)=>{
							if (err){
								console.log(err);
								return res.status(500).json({message: 'Database error changing reservation status'});	
							}else{
								return res.status(200).json({message: 'Reservation status changed'});	
							};
						});
					};
				});		
			}else{
				return res.status(400).json({message: 'Bad request'});	
			};
		}else if(req.query.cancel){
			dbHandlers.Qgen_exam_status.Qget_byProcessCancelID(0,(err,idcancel)=>{
				if (err){
					console.log(err);
					return res.status(500).json({message: 'Error trying to fetch cancel id'});	
				}else{
					console.log(idcancel)
					dbHandlers.Qgen_reservations.Qpatch_Cancelreservation(idcancel[0].idexam_status,req.query.idReservation,(err)=>{
						if (err){
							console.log(err);
							return res.status(500).json({message: 'Databse error canceling reservation'});
						}else{
							return res.status(200).json({message: 'Reservation cancel'});	
						};
					});
				};
			});
		}else{
			return res.status(400).json({message: 'Bad request'});	
		};
	}else if(req.query.check){
		// validates reservation and creates booking
		if (req.body.idReservation){
			dbHandlers.Qgen_reservations.Qget_byIdPaidPendingReservations(req.params.idExam_center,
						req.body.idReservation,async (err,reservations)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message: 'Database error fetching pendent paid reservations'});	
				}else if(reservations.length === 0) {
					return res.status(204).json({message:"Reservation not paid"});
				}else{
					// Promise to get account id
					var P_account=new Promise((resolve,reject)=>{
						dbHandlers.Qgen_accounts.Qget_byUserAccount(req.user.user,(e,account)=>{
							if(e){
								console.log(e);
								return res.status(500).json({message:"Error getting account"});
								reject();
							}else{
								resolve(account.idAccount);	
							};	
						});
					});
					var temp_account = await P_account.then();
					// get reservation by id
					dbHandlers.Qgen_reservations.Qget_byIdReservation(req.body.idReservation,(err,reservation)=>{
						console.log("reservation "+ JSON.stringify(reservation))
						if(err){
							console.log(err);
							return res.status(500).json({message:'Error getting reservation'});	
						}else{
							// get the school
							dbHandlers.Qgen_school.Qget_byPermitSchool_Exam_Center(reservation[0].School_Permit,reservation[0].Exam_center_idExam_center,
										(err,school)=>{
								console.log("school "+ JSON.stringify(school));
								if (err){
									console.log(err);
									return res.status(500).json({message: 'Error getting school'});	
								}else{
									// creates the student
									dbHandlers.Qgen_student.Qcreate_Student(reservation[0].T_ID_type_idT_ID_type,
											[reservation[0].Student_name,reservation[0].Student_num,
											reservation[0].Birth_date,reservation[0].ID_num,
											reservation[0].ID_expire_date,reservation[0].Tax_num,
											reservation[0].Drive_license_num,reservation[0].Obs],
											(err,results)=>{
										// console.log("student")
										if(err){
											console.log(err);
											return res.status(500).json({message: 'Error creating student'});	
										}else{
											let tempId=results.insertId;
											dbHandlers.Qgen_student_license.Qcreate_Student_license(
													[reservation[0].Student_license,
													reservation[0].Expiration_date,1],
													tempId,school[0].idSchool,
													reservation[0].idType_category,(err,results)=>{
												// console.log("license created");
												if (err){
													console.log(err);
													dbHandlers.Qgen_student.Qdelete_byIdStudent(tempId,(err,results)=>{
														return res.status(500).json({message:"Error creating student license"});
													});		
												}else{
													var tempstudent_license=results.insertId;
													dbHandlers.Qgen_exam_status.Qget_byProcessBookedID(1,(e,id_status)=>{
														if(e){
															console.log(e);
															return res.status(500).json({message:"Error fetching id exam status"});		
														}else{
															dbHandlers.Qgen_sicc_status.Qget_byProcess_Operation_Sicc_status(1,1,(e,id_sicc)=>{
																if(e){
																	console.log(e);
																	return res.status(500).json({message:"Error fetching id exam status"});
																}else{
																	// creates booking
																	dbHandlers.Qgen_booked.Qcreate_byReservationBooking([new Date(),reservation[0].Obs,
																				tempstudent_license,reservation[0].idTimeslot,temp_account,
																				req.params.idExam_center,reservation[0].Exam_type_idExam_type,
																				id_status[0].idexam_status,id_sicc[0].idsicc_status,
																				req.body.idReservation],(err,results)=>{
																		if (err){
																			console.log(err);
																			return res.status(500).send({message:"Error creating booking"});
																		}else{
																			dbHandlers.Qgen_exam_status.Qget_byProcessAprovedID(0,(e,id_status)=>{
																				if (e){
																					console.log(e);	
																				}else{
																					// Change the status of given reservation to APROVED
																					dbHandlers.Qgen_reservations.Qpatch_Pendentreservation(id_status[0].idexam_status,
																								req.body.idReservation,(e)=>{
																						if (e){
																							console.log(e);
																							return res.status(500).send({message:"Error creating booking"});
																						}else{
																							return res.status(200).send({message:"Booking created"});
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
		}else{
			return res.status(400).json({message: 'Bad request'});	
		};
	}else{
		return res.status(400).json({message:'Bad request'});
	};
};

module.exports = {
	getList_ReservationsByIdTimeslot,
	postList_Reservations,
	deleteList_reservations,
	patchList_Reservations
}





// var options = {
												// 	url: config.easy_pay.easy_pay_url,
												// 	method: 'POST',
												// 	headers: {
												// 		'AccountId': config.easy_pay.easy_pay_account_id,
												// 		'ApiKey': config.easy_pay.easy_pai_api_key
												// 	},
												// 	body: {
												// 		"value": price[0].Value,
												// 		"method": "mb"
												// 	},
												// 	json: true
												// };
												// //send request to easypay
												// request(options, function (error, response, body) {
												// 	if (error) {
												// 		console.log(error);
												// 		return res.status(500).json({message:"Error generating EasyPay reference"});
												// 	} else if (response.statusCode === 201) {
												// 		var entity = body.method.entity
												// 		var reference = body.method.reference
												// 		var student = req.body.Student_name
												// 		var tax_num = req.body.tax_num
												// 		var idEasyPay = body.id
												// 		dbHandlers.Qgen_reservations.Qpatch_reservation({ idEasyPay }, reservations[0].idReservation, (error) => { // Unlocks reservation
												// 			if (error) {
												// 				console.log(error);
												// 				return res.status(500).json({ message: 'There was an error while trying to update the reservation (idEasyPay).' });
												// 			} else {
												// 				dbHandlers.Qgen_exam_center.Qget_smtpCredencials(req.params.idExam_center, (err, smtpResults) => {
												// 					if (err || smtpResults <= 0) {
												// 						console.log(err);
												// 						return res.status(500).json({ message: "Error creating pendent payment" });
												// 					} else {
												// 						// // create reusable transporter object using the default SMTP transport
												// 						let transporter = nodemailer.createTransport({
												// 							host: smtpResults[0].SMTP_server,
												// 							// port: 587,
												// 							secure: false,
												// 							auth: {
												// 								user: smtpResults[0].SMTP_user, // generated ethereal user
												// 								pass: smtpResults[0].SMTP_pass // generated ethereal password
												// 							},
												// 							tls: {
												// 								rejectUnauthorized: false
												// 							}
												// 						});
												// 						// get receiver info from school.permit
												// 						dbHandlers.Qgen_school.Qget_byPermitSchool_Exam_Center(req.body.School_Permit,req.params.idExam_center, 
												// 											(err, school_info) => {
												// 							if (err || school_info <= 0) {
												// 								console.log(err);
												// 								return res.status(500).json({message:"Error getting school email"});
												// 							}else{
												// 								var toEmail = school_info[0].Email1 || school_info[0].Email2;
												// 								console.log("tenho email")
												// 							};
												// 							dbHandlers.Qgen_timeslot.Qget_timeslotById(req.body.idTimeslot,req.params.idExam_center, 
												// 											async (err, timeslot) => {
												// 								if (err || timeslot <= 0) {
												// 									console.log(err);
												// 									return res.status(500).json({message:"Error getting school email"});
												// 								} else {
												// 									var date = timeslot[0].Timeslot_date
												// 									date=moment(date).format('DD-MM-YYYY');

												// 									var hour = timeslot[0].Begin_time												
												// 									var text = 'Dados de pagamento para a reserva de dia ' + date + ' às ' + hour + ', para o aluno ' + student + '(NIF: ' + tax_num + '):' +
												// 										'\nEntidade: ' + entity +
												// 										'\nReferência: ' + reference +
												// 										'\nValor: ' + price + '€.'
												
												// 									var html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"><head><meta charset="UTF-8"><meta content="width=device-width, initial-scale=1" name="viewport"><meta name="x-apple-disable-message-reformatting"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta content="telephone=no" name="format-detection"><title>New email</title> <!--[if (mso 16)]><style type="text/css">     a {text-decoration: none;}     </style><![endif]--> <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><style type="text/css">' +
												// 										'@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:12px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { ' +
												// 										'text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:20px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r ' +
												// 										'{ padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }#outlook a {	padding:0;}.ExternalClass {	width:100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {	line-height:100%;}.es-button ' +
												// 										'{	mso-style-priority:100!important;	text-decoration:none!important;}a[x-apple-data-detectors] {	color:inherit!important;	text-decoration:none!important;	font-size:inherit!important;	font-family:inherit!important;	font-weight:inherit!important;	line-height:inherit!important;}.es-desk-hidden {	display:none;	float:left;	overflow:hidden;	width:0;	max-height:0;	line-height:0;	mso-hide:all;}</style></head><body style="width:100%;font-family:arial, \'helvetica neue\', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"><div class="es-wrapper-color" style="background-color:#F6F6F6;"> <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f6f6f6"></v:fill> </v:background><![endif]-->' +
												// 										'<table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"><tr style="border-collapse:collapse;"><td valign="top" style="padding:0;Margin:0;"><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"><tr style="border-collapse:collapse;"><td align="center" style="padding:0;Margin:0;"><table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" align="center"><tr style="border-collapse:collapse;">' +
												// 										'<td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;"> <!--[if mso]><table width="560" cellpadding="0" cellspacing="0"><tr><td width="356" valign="top"><![endif]--><table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"><tr style="border-collapse:collapse;"><td class="es-m-p0r es-m-p20b" width="356" valign="top" align="center" style="padding:0;Margin:0;"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr style="border-collapse:collapse;"><td align="center" style="padding:0;Margin:0;display:none;"></td></tr></table></td></tr></table> <!--[if mso]></td><td width="20"></td><td width="184" valign="top"><![endif]-->' +
												// 										'<table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr style="border-collapse:collapse;"><td width="184" align="left" style="padding:0;Margin:0;"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr style="border-collapse:collapse;"><td align="center" style="padding:0;Margin:0;display:none;"></td></tr></table></td></tr></table> <!--[if mso]></td></tr></table><![endif]--></td></tr></table></td></tr></table><table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"><tr style="border-collapse:collapse;"><td align="center" style="padding:0;Margin:0;">' +
												// 										'<table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"><tr style="border-collapse:collapse;"><td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr style="border-collapse:collapse;"><td width="560" class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;"><table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr style="border-collapse:collapse;"><td align="center" class="es-m-txt-c" style="padding:0;Margin:0;">' +
												// 										'<img src="cid:logo" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" width="108"></td></tr></table></td></tr></table></td></tr><tr style="border-collapse:collapse;"><td align="left" style="Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;padding-bottom:40px;"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr style="border-collapse:collapse;"><td width="560" valign="top" align="center" style="padding:0;Margin:0;"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr style="border-collapse:collapse;">' +
												// 										'<td class="es-m-txt-c" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:40px;padding-right:40px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:24px;color:#333333;text-align:center;">' +
												// 										'Dados de pagamento para a reserva de dia ' + date + ' às ' + hour + ', para o candidato ' + student + ' (NIF: ' + tax_num + '):</p></td></tr><tr style="border-collapse:collapse;"><td align="center" style="padding:0;Margin:0;padding-top:20px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:21px;color:#333333;"></p></td></tr><tr style="border-collapse:collapse;"><td style="padding:0;Margin:0;">' +
												// 										'<table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;margin:auto;width:40%;font-size:16px;"><tr style="border-collapse:collapse;"><td style="padding:0;Margin:0;text-align:left;">' +
												// 										'<b>Entidade:</b></td><td style="padding:0;Margin:0;text-align:right;">' + entity + '</td></tr><tr style="border-collapse:collapse;"><td style="padding:0;Margin:0;text-align:left;">' +
												// 										'<b>Referência:</b></td><td style="padding:0;Margin:0;text-align:right;">' + reference + '</td></tr><tr style="border-collapse:collapse;"><td style="padding:0;Margin:0;text-align:left;">' +
												// 										'<b>Valor:</b></td><td style="padding:0;Margin:0;text-align:right;">' + price[0].Value + '€</td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table>' +
												// 										'<table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;"><tr style="border-collapse:collapse;"><td align="center" style="padding:0;Margin:0;"><table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;"><tr style="border-collapse:collapse;"><td align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr style="border-collapse:collapse;">' +
												// 										'<td width="560" valign="top" align="center" style="padding:0;Margin:0;"><table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr style="border-collapse:collapse;"><td class="es-m-txt-c" align="center" style="padding:20px;Margin:0;"><table width="75%" height="100%" cellspacing="0" cellpadding="0" border="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"><tr style="border-collapse:collapse;"><td style="padding:0;Margin:0px 0px 0px 0px;border-bottom:1px solid #CCCCCC;background:none;height:1px;width:100%;margin:0px;"></td></tr></table></td></tr><tr style="border-collapse:collapse;"><td class="es-m-txt-c" align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;">' +
												// 										'<p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:11px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:17px;color:#333333;">© 2019 ANIECA - Associação Nacional dos Industriais do Ensino de Condução Automóvel</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></div></body>' +
												// 										'</html>'
												
												// 									//send mail with defined transport object
												// 									let info = await transporter.sendMail({
												// 										from: '"ANIECA" <' + smtpResults[0].SMTP_user + '>', // sender address
												// 										to: 'raquel.melo@knowledgebiz.pt', // TODO change to toEmail
												// 										subject: 'Referência MB',
												// 										text, // plain text body
												// 										html, // html body
												// 										attachments: [{
												// 											filename: 'anieca.png',
												// 											path: __dirname + '/anieca.png', //TODO colocar imagem da anieca algures
												// 											cid: 'logo'
												// 										}]
												// 									});
												// 									console.log(info);
												// 									return res.status(200).json({message:'Reservation added.'});
												// 								}
												// 							});
												// 						});
												// 					};
												// 				});
												// 			};
												// 		});
												// 	};
												// });