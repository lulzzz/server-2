var dbHandlers = require("../db");

// GET request for bookings
var getList_Pendent_Payments = (req,res,next)=>{
	// console.log("Getting pendent payments.");
	if (req.params.idExam_center>0){
		if(req.query.idSchool && !req.query.examnotpaid){
			//getAll in school
			dbHandlers.Qgen_pendent_payments.Qget_byIdSchool_PendentPayment(req.query.idSchool,
							req.params.idExam_center,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting pendent payments by school"});
				}else if(results.length<=0){
					res.status(204).json({message:"No results"});	
				}else{
					res.status(200).json(results);
				};	
			});
		}else if(req.query.tax){
			//getAll in school
			dbHandlers.Qgen_pendent_payments.Qget_byExam_Center_Tax(req.params.idExam_center,(err,taxes)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting pendent taxes"});
				}else if(taxes.length<=0){
					res.status(204).json({message:"No results"});	
				}else{
					res.status(200).json(taxes);
				};	
			});
		}else if(req.query.School_idSchool && req.query.examnotpaid){
			//getAll in school
			dbHandlers.Qgen_pendent_payments.Qget_byNotPaid_Exam(req.params.idExam_center,req.query.idSchool,(err,taxes)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting exams to be paid"});
				}else if(taxes.length<=0){
					res.status(204).json({message:"No results"});	
				}else{
					res.status(200).json(taxes);
				};	
			});
		}else if(req.query.taxnotpaid){
			//getAll in school
			dbHandlers.Qgen_pendent_payments.Qget_byNotPaid_Tax(req.params.idExam_center,(err,taxes)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting exams to be paid"});
				}else if(taxes.length<=0){
					res.status(204).json({message:"No results"});	
				}else{
					res.status(200).json(taxes);
				};	
			});	
		}else{
			//getAll in exam center
			dbHandlers.Qgen_pendent_payments.Qget_AllPendentPayments_Exam_Center(req.params.idExam_center,
								(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error getting pendent payments by exam center"});
				}else if(results.length<=0){
					res.status(204).json({message:"No results"});	
				}else{
					res.status(200).json(results);
				};
			});	
		}
	}else{
		//getAll
		dbHandlers.Qgen_pendent_payments.Qget_AllPendentPayments(function(err,results){
			if(err){
				console.log(err);
				res.status(500).json({message:"Database error getting pendent_payments"});
			}else if(results.length<=0){
				res.status(204).json({message:"No results"});	
			}else{
				res.status(200).json(results);
			}
		});
	};
};

module.exports = {
	getList_Pendent_Payments
}


// async function create_pendent_payment(Exam_num,booking,cb){
// 	console.log("Creating pendent payment");
// 	var P_price = new Promise((resolve,reject)=>{
// 		dbHandlers.Qgen_school.Qget_School_Associated(booking.Student_license_idStudent_license,
// 						(err,results)=>{
// 			if(err){
// 				// cb(true,{error:'Error getting student associated number'});
// 				reject({error:'Error getting student associated number'});
// 			}else if(!results.length){
// 				// not associated
// 				dbHandlers.Qgen_exam_price.Qget_price_NO_associated(booking.Exam_type_idExam_type,
// 							(err,price)=>{
// 					if(err){
// 						// cb(true,{error:'Error getting exam price non associated'});	
// 						reject({error:'Error getting exam price non associated'});
// 					}else{
// 						resolve(price[0].Price_no_associated);
// 					};		
// 				});
// 			}else{
// 				// associated
// 				dbHandlers.Qgen_exam_price.Qget_price_associated(booking.Exam_type_idExam_type,
// 							(err,price)=>{
// 					if(err){
// 						// cb(true,{error:'Error getting exam price associated'});
// 						reject({error:'Error getting exam price associated'});
// 					}else{
// 						resolve(price[0].Price);
// 					};
// 				});
// 			};
// 		});
// 	});

// 	let exam_price=await P_price;
// 	console.log("Exam price defined " + exam_price);
// 	dbHandlers.Qgen_pendent_payments.Qcreate_PendentPayment([Exam_num,exam_price,booking.idBooked,
// 				booking.Student_license_idStudent_license],(err,results)=>{
// 		if (err){
// 			console.log(err);
// 			cb(true,{error:'Error creating pendent payment'});
// 		}else{
// 			cb(null,results);
// 		};
// 	});
// };


// async function create_pendent_payment(idbooking,idStudent_license,price,cb){
// 	console.log("Creating pendent payment");
// 	var P_price = new Promise((resolve,reject)=>{
// 		dbHandlers.Qgen_school.Qget_School_Associated(booking.Student_license_idStudent_license,
// 						(err,results)=>{
// 			if(err){
// 				// cb(true,{error:'Error getting student associated number'});
// 				reject({error:'Error getting student associated number'});
// 			}else if(!results.length){
// 				// not associated
// 				dbHandlers.Qgen_exam_price.Qget_price_NO_associated(booking.Exam_type_idExam_type,
// 							(err,price)=>{
// 					if(err){
// 						// cb(true,{error:'Error getting exam price non associated'});	
// 						reject({error:'Error getting exam price non associated'});
// 					}else{
// 						resolve(price[0].Price_no_associated);
// 					};		
// 				});
// 			}else{
// 				// associated
// 				dbHandlers.Qgen_exam_price.Qget_price_associated(booking.Exam_type_idExam_type,
// 							(err,price)=>{
// 					if(err){
// 						// cb(true,{error:'Error getting exam price associated'});
// 						reject({error:'Error getting exam price associated'});
// 					}else{
// 						resolve(price[0].Price);
// 					};
// 				});
// 			};
// 		});
// 	});

// 	let exam_price=await P_price;
// 	console.log("Exam price defined " + exam_price);
// 	dbHandlers.Qgen_pendent_payments.Qcreate_PendentPayment([Exam_num,exam_price,booking.idBooked,
// 				booking.Student_license_idStudent_license],(err,results)=>{
// 		if (err){
// 			console.log(err);
// 			cb(true,{error:'Error creating pendent payment'});
// 		}else{
// 			cb(null,results);
// 		};
// 	});
// };