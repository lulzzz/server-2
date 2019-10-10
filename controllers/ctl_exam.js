var dbHandlers = require("../db");
var ctl_pendent_payment=require("./ctl_pendent_payment");
var _=require('lodash');

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
			dbHandlers.Qgen_exam.Qupdate_byIdExam(req.query.idExam, _.pick(req.body, ['Exam_num','Car_plate','Drive_license_emit',
							'Revision','Complain','Booked_idBooked','Account_idAccount','Pauta_idPauta',
							'T_exam_results_idT_exam_results','T_exam_status_idexam_status','sicc_status_idsicc_status']),(err,results)=>{
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