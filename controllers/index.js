module.exports = {
	authorization:require("./ctl_account"),
	passport:require("./passport"),
	exam_center : require("./ctl_exam_center"),
	school:require("./ctl_schools"),
	invoice_info:require("./ctl_invoice_info"),
	student:require("./ctl_students"),
	id_type:require("./ctl_T_ID_type"),
	student_license:require("./ctl_student_license"),
	student_note:require("./ctl_student_note"),
	examiner:require("./ctl_examiner"),
	examiner_qualification:require("./ctl_examiner_qualification"),
	exam_type:require("./ctl_exam_type"),
	reservation:require("./ctl_reservation"),
	category:require("./ctl_category"),
	exam_price:require("./ctl_exam_price"),
	resources:require("./ctl_resource"),
	permissions:require("./ctl_permission"),
	roles:require("./ctl_role"),
	permits:require("./ctl_functionality"),
	bookings:require("./ctl_booked"),
	exam_routes:require("./ctl_exam_route"),
	exams:require("./ctl_exam"),
	pautas:require("./ctl_pauta"),
	exam_results:require("./ctl_T_exam_result"),
	exam_status:require("./ctl_T_exam_status"),
	work_hours:require("./ctl_work_hour"),
	pendent_payments:require("./ctl_pendent_payment"),
	transactions:require("./ctl_transactions"),
	delegations:require("./ctl_T_delegation"),
	banks:require("./ctl_banks"),
	tax:require("./ctl_T_tax"),
	location:require("./ctl_location"),
	timeslot:require("./ctl_timeslot"),
	groups:require("./ctl_groups"),
	payment_methods:require("./ctl_payment_method"),
	payments:require("./ctl_payment"),
	groups:require("./ctl_groups"),
	timeslot:require("./ctl_timeslot"),
	imtt:require("./ctl_imtt"),
	sicc_status:require("./ctl_T_sicc_status"),
	easyPay:require("./ctl_easyPay")
};


	// 

// authorization : function(req,res,next){
// 	// console.log("0. THIS GUY IS AUTHORIZED USING HTTP VERB " + req.method);
// 	next();
// },

// var dbHandlers = require("../db");

// authorization=function(req,res,next){
// 	// user
// 	if (req.body.User){
// 		//getById
// 		dbHandlers.Qgen_accounts.Qget_Account(req.params.User,function(err,results){
// 			if(err){
// 				res.status(500).send(JSON.stringify(err.sqlMessage));
// 			}else if(results.length<=0){
// 				res.status(204).send("User not found");	
// 			}else{
// 				console.log(JSON.stringify(results,null,2));
// 				res.status(200).send(results);
// 			};
// 		});
// 	}else{
// 		res.status(400).send("Bad params");
// 	};
// };


// 