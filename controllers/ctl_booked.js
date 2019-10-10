var dbHandlers = require("../db");
var _ = require('lodash');

// GET request for bookings
var getList_Bookings_Exam_Center = (req,res,next)=>{
	if (req.params.idExam_center>0){
		if(req.query.idBooked){
			//getById
			dbHandlers.Qgen_booked.Qget_byIdBooking_Exam_Center(req.query.idBooked,req.params.idExam_center, 
								(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting bookings"});
				}else if(results.length<=0){
					res.status(204).json({message:"No content"});	
				}else{
					res.status(200).json(results);
				}
			});
		}else if(req.query.Exam_date){
			//getBy exam date
			dbHandlers.Qgen_booked.Qget_byExamDateBooking_Exam_Center(req.query.Exam_date,
								req.params.idExam_center,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting bookings"});
				}else if(results.length<=0){
					res.status(204).json({message:"No content"});	
				}else{
					res.status(200).json(results);
				}
			});
		}else if(req.query.Exam_num){
			// get by exam number
			dbHandlers.Qgen_booked.Qget_byExamNumBooking_Exam_Center(req.query.Exam_num,
								req.params.idExam_center,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting bookings"});
				}else if(results.length<=0){
					res.status(204).json({message:"No content"});	
				}else{
					res.status(200).json(results);
				}
			});
		}else{
			//getAll in exam center
			dbHandlers.Qgen_booked.Qget_AllBookings_Exam_Center(req.params.idExam_center,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting bookings"});
				}else if(results.length<=0){
					res.status(204).json({message:"No content"});	
				}else{
					// console.log(results);
					res.status(200).json(results);
				}
			});	
		}
	}else{
		//getAll
		dbHandlers.Qgen_booked.Qget_AllBookings((err,results)=>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Error getting bookings"});
			}else if(results.length<=0){
				res.status(204).json({message:"No content"});	
			}else{
				res.status(200).json(results);
			}
		});
	};
};

// POST request for booking
async function createBooking (req,res,next){
	// mandatory fields (missing Account_idAccount)
	// not advance search
	if (!req.query.search){
		if (req.body.Booked_date  && req.body.Student_license_idStudent_license && req.body.Timeslot_idTimeslot 
					&& req.body.Exam_center_idExam_center && req.body.Exam_type_idExam_type){
			// Promise to get account id
			var P_account=new Promise((resolve,reject)=>{
				dbHandlers.Qgen_accounts.Qget_byUserAccount(req.user.user,(e,account)=>{
					if(err){
						console.log(err);
						return res.status(500).send({message:"Error getting account"});
						reject();
					}else{
						resolve(account.idAccount);	
					};	
				});
			});
			// Promise to get status id
			var P_status=new Promise((resolve,reject)=>{
				// process 1 is always the booking
				dbHandlers.Qgen_exam_status.Qget_byProcessExam_Status(1,(err,results)=>{
					if(err){
						console.log(err);
						return res.status(500).send({message:"Error getting status"});
						reject();
					}else{
						resolve(results[0].idexam_status);	
					}
				});
			});

			let temp_status = await P_status.then();
			let temp_account = await P_account.then();
			
			// creates booking
			dbHandlers.Qgen_booked.Qcreate_Booking([req.body.Booked_date,req.body.Obs,
						req.body.Student_license_idStudent_license,req.body.Timeslot_idTimeslot,temp_account,
						req.body.Exam_center_idExam_center,req.body.Exam_type_idExam_type,temp_status],
						(err,results)=>{
				if(err){
					// fail inserting
					console.log(err);
					res.status(500).json({message:"Error creating booking"});	
				}else{
					// sucess
					var temp_booking=results.insertId;
					// create pendent payment for that booking depending if has membership or not
					dbHandlers.Qgen_school.Qget_School_Associated(req.body.Student_license_idStudent_license,
								(err,school)=>{
						if (err || school.length<=0){
							console.log(err);
							res.status(500).json({message:"Error creating booking"});
						}else{
							if(school.Associate_num === null){
								dbHandlers.Qgen_exam_price.Qget_price_NO_associated(req.body.Exam_type_idExam_type,
										(err,price)=>{
									if (err || price.length<=0){
										console.log(err);
										res.status(500).json({message:"Error getting exam price"});	
									}else{
										dbHandlers.Qgen_pendent_payments.Qcreate_PendentPayment_exam(price[0].Value,temp_booking,
												req.body.Student_license_idStudent_license,(err,results)=>{
											if(err){
												res.status(500).json({message:"Error creating pendent payment"});
											}else{
												res.status(200).json({message:'Booking created!'});	
											}
										});	
									}
								});
							}else{
								dbHandlers.Qgen_exam_price.Qget_price_associated(req.body.Exam_type_idExam_type,
										(err,price)=>{
									if (err || price.length<=0){
										res.status(500).json({message:"Error getting exam price"});	
									}else{
										dbHandlers.Qgen_pendent_payments.Qcreate_PendentPayment_exam(price[0].Value,
												temp_booking,req.body.Student_license_idStudent_license,
												(err,results)=>{
											if(err){
												console.log(err);
												res.status(500).json({message:"Error creating pendent payment"});
											}else{
												res.status(200).json({message:'Booking created!'});	
											}
										});	
									}
								});
							}
						};
					});	
				};	
			});
		}else{
			// missing mandatory fields
			res.status(400).json({message:"Bad Request."});	
		};
	}else{
		var conditions = ['Booked.Exam_center_idExam_center = ?'];
		var values = [req.body.Exam_center_idExam_center];
		var conditionsStr;
		if (typeof req.body.Exam_type_idExam_type !== 'undefined') {
			conditions.push('Booked.Exam_type_idExam_type = ?');
			values.push(req.body.Exam_type_idExam_type);
		};
		if (typeof req.body.Booked_date1 !== 'undefined' && typeof req.body.Booked_date2 === 'undefined') {
			conditions.push('Booked.Booked_date = ?');
			values.push(req.body.Booked_date1);
		}else if(typeof req.body.Booked_date1 !== 'undefined' && typeof req.body.Booked_date2 !== 'undefined'){
			conditions.push('Booked.Booked_date BETWEEN ? AND ?');
			values.push(req.body.Booked_date1);
			values.push(req.body.Booked_date2);
		}else if (typeof req.body.Booked_date1 === 'undefined' && typeof req.body.Booked_date2 !== 'undefined') {
			conditions.push('Booked.Booked_date = ?');
			values.push(req.body.Booked_date2);
		};
		if (typeof req.body.Permit !== 'undefined') {
			conditions.push('School.Permit = ?');
			values.push(req.body.Permit);
		};
		if (typeof req.body.School_name !== 'undefined') {
			conditions.push('School.School_name LIKE ?');
			values.push("%"+req.body.School_name+"%");
		};
		if (typeof req.body.Student_name !== 'undefined') {
			conditions.push('Student.Student_name LIKE ?');
			values.push("%"+req.body.Student_name+"%");
		};
		if (typeof req.body.Student_num !== 'undefined') {
			conditions.push('Student.Student_num = ?');
			values.push(req.body.Student_num);
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
		}else if(typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined'){
			conditions.push('Timeslot.Timeslot_date BETWEEN ? AND ?');
			values.push(req.body.Timeslot_date1);
			values.push(req.body.Timeslot_date2);
		};
		if (typeof req.body.T_exam_status_idexam_status !== 'undefined') {
			conditions.push('Booked.T_exam_status_idexam_status = ?');
			values.push(req.body.T_exam_status_idexam_status);
		};
		if (typeof req.body.Pauta_num !== 'undefined') {
			conditions.push('Pauta.Pauta_num = ?');
			values.push(req.body.Pauta_num);
		};
		if (typeof req.body.Payments_idPayments !== 'undefined') {
			conditions.push('Pendent_payments.Payments_idPayments IS NOT NULL');
			// values.push(req.body.Payments_idPayments);
		};
		// concateneate query
		conditionsStr=conditions.length ? conditions.join(' AND ') : '1';
		conditionsStr= conditionsStr + " GROUP BY idBooked"
		dbHandlers.Qgen_booked.Qget_search(conditionsStr,values,(err,results)=>{
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
var deleteBooking = (req,res,next)=>{
	console.log("Delete Booking");
	if(req.query.idBooked){
		dbHandlers.Qgen_booked.Qdelete_byIdBooking(req.query.idBooked, (err,results)=>{
			if(err){
				console.log(err);
				return res.status(500).json({message:"Error deleting booking"});
			}else{
				return res.status(200).json({message:"Booking deleted"});
			}
		});
	}else{
		// missing id for this request
		res.status(400).json({message:"Bad Request."});	
	};
};

// UPDATE request for School
var updateBooking = (req,res,next)=>{
	console.log("Update booking");
	console.log(req.body)
	if(req.query.idBooked){
		if(req.body.Exam_num||req.body.Pauta_num||req.body.Booked_date||req.body.Exam_date||req.body.Obs||
						req.body.Student_license_idStudent_license||req.body.Exam_center_idExam_center||
						req.body.Exam_type_idExam_type||req.body.T_exam_status_idexam_status){
			dbHandlers.Qgen_booked.Qupdate_byIdBooking(req.query.idBooked,_.pick(req.body,['Exam_num','Pauta_num','Booked_date','Exam_date','Obs',
							'Student_license_idStudent_license','Exam_center_idExam_center','Exam_type_idExam_type','T_exam_status_idexam_status']),
							(err,results)=>{
				if(err){
					console.log(err);
					return res.status(500).json({message:"Error updating booking"});
				}else{
					return res.status(200).json({message:"Booking updated."});		
				};
			});
		};
	}else{
		// missing id for this request
		return res.status(400).json({message:"Bad Request."});	
	};
};

module.exports = {
	getList_Bookings_Exam_Center,
	createBooking,
	deleteBooking,
	updateBooking
}