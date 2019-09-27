var dbHandlers = require("../db");

// GET request for Payment method
var getList_Payment_Method = (req,res,next)=>{
	//getById
	dbHandlers.Qgen_payment_method.Qget_AllPaymentMethod((err,results)=>{
		if(err){
			console.log(err);
			res.status(500).json({message:"Database error getting payment methods"});
		}else{
			res.status(200).json(results);
		};
	});	
};

// POST request for Payment method
var createPayment_Method =(req,res,next)=>{
	// create examiner given exam_center id
	dbHandlers.Qgen_payment_method.Qcreate_PaymentMethod(req.body.Name,(err,results)=>{
		if(err){
			console.log(err);
			return res.status(500).send({message:"Error creating payment method"});	
		}else{
			return res.status(200).send({message:"Payment method created"});
		};
	});
};

// DELETE request for Payment method
var deletePayment_Method = (req,res,next)=>{
	if(parseInt(req.query.idPayment_method)>0){
		dbHandlers.Qgen_payment_method.Qdelete_PaymentMethod(req.query.idPayment_method, function(err,results){
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:"Error deleting payment method"});
			}else{
				return res.status(200).json({message:"Payment method deleted"});
			};
		});
	}else{
		// missing id for this request
		res.status(400).send({message:"Bad Request"});	
	};
};

// UPDATE request for Payment method
var updatePayment_Method = (req,res,next)=>{
	if(parseInt(req.query.idPayment_method)>0){
		dbHandlers.Qgen_payment_method.Qpatch_PaymentMethod(req.query.idPayment_method, req.body.Name,
				(err,results)=>{
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:"Error patching payment method"});
			}else{
				return res.status(200).json({message:"Payment method patched"});
			};
		});
	}else{
		return res.status(400).send({message:"Bad Request"});
	};
};

module.exports = {
	getList_Payment_Method,
	createPayment_Method,
	deletePayment_Method,
	updatePayment_Method
}