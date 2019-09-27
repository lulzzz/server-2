var dbHandlers = require("../db");

// POST request for exam price
var createExam_price=(values,id_exam_type,id_tax,cb)=>{
	console.log("Creating Exam price");
	// console.log(values);
	dbHandlers.Qgen_exam_price.Qcreate_Exam_price(values,id_exam_type,id_tax,(err,results)=>{
		if (err){
			cb('Error inserting exam price in Database.');
		}else{
			cb(null,results);
		};
	});		
};

// UPDATE request for exam type
var updateExam_price = (idExam_price,body,cb)=>{
	dbHandlers.Qgen_exam_price.Qupdate_Exam_price(body,idExam_price,function(err,results){
		if(err){
			// internal error
			cb('Error updating exam price in Database.');
		}else{
			cb(null,results);
		}
	});
};

module.exports = {
	createExam_price,
	updateExam_price
}