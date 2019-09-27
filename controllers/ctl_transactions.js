var dbHandlers = require("../db");
var _ = require('lodash')

// GET request for Transaction
var getList_Transactions = (req,res,next)=>{
	if (req.params.idExam_center>0){
		if(req.query.School_idSchool){
			if (!req.query.All){
				// transactions without payment associated
				dbHandlers.Qgen_transactions.Qget_AllUnusedTransactions_School(req.params.idExam_center,
							req.query.School_idSchool,(err,results)=>{
					if(err){
						console.log(err);
						res.status(500).send({message:"Error getting all transactions"});
					}else if(results.length<=0){
						res.status(204).send({message:"No content"});
					}else{
						res.status(200).send(results);
					};
				});
			}else if (req.query.notused){
				// all transactions for given school
				dbHandlers.Qgen_transactions.Qget_byNotUsued_Transaction(req.params.idExam_center,
							req.query.School_idSchool,(err,results)=>{
					if(err){
						console.log(err);
						res.status(500).send({message:"Error getting not used transactions"});
					}else if(results.length<=0){
						res.status(204).send({message:"No content"});
					}else{
						res.status(200).send(results);
					};
				});		
			}else{
				// all transactions for given school
				dbHandlers.Qgen_transactions.Qget_AllTransactions_School(req.params.idExam_center,
							req.query.School_idSchool,(err,results)=>{
					if(err){
						console.log(err);
						res.status(500).send({message:"Error getting all transactions"});
					}else if(results.length<=0){
						res.status(204).send({message:"No content"});
					}else{
						res.status(200).send(results);
					};
				});			
			};
		}else{
			// all transactions for given exam center
			dbHandlers.Qgen_transactions.Qget_AllTransactions_Exam_Center(req.params.idExam_center,
							(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).send({message:"Error getting all transactions"});
				}else if(results.length<=0){
					res.status(204).send({message:"No content"});
				}else{
					res.status(200).send(results);
				};
			});	
		};
	}else{
		// all transactions
		dbHandlers.Qgen_transactions.Qget_AllTransactions((err,results)=>{
			if(err){
				console.log(err);
				res.status(500).send({message:"Error getting all transactions"});
			}else if(results.length<=0){
				res.status(204).send({message:"No content"});
			}else{
				res.status(200).send(results);
			};
		});		
	};
};

// create new transaction
var create_Transactions = (req,res,next)=>{

	if (req.body.Transaction_num===undefined) {
		var Transaction_num=null;
	} else{
		var Transaction_num=req.body.Transaction_num;
	};

	if (req.body.T_Status_check_idT_Status_check===undefined) {
		var idT_Status_check=null;
	} else{
		var idT_Status_check=req.body.T_Status_check_idT_Status_check;
	};

	if (req.body.Banks_idBanks===undefined) {
		var Banks_idBanks=null;
	} else{
		var Banks_idBanks=req.body.Banks_idBanks;
	};

	dbHandlers.Qgen_transactions.Qcreate_Transactions([Transaction_num,req.body.Transaction_value,
			req.body.Transaction_date,req.body.Exam_center_idExam_center,req.body.School_idSchool,
			req.body.Payment_method_idPayment_method,idT_Status_check,Banks_idBanks],(err,results)=>{
		if (err){
			console.log(err);
			res.status(500).send({message:"Error creating transaction"});	
		}else{
			res.status(200).send({message:"Transaction created"});	
		};
	});
};

// Delete transaction by id
var delete_Transaction = (req,res,next) =>{
	if (parseInt(req.query.idTransactions)>0){
		dbHandlers.Qgen_transactions.Qdelete_Transaction(req.query.idTransactions,(err,results) =>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Database error deleting transaction"});
			}else{ 
				res.status(200).json({message:"Transaction deleted"});
			};
		});
	}else{
		res.status(400).json({message:"Bad request"});
	};
};

//update Transaction
var update_Transaction = (req,res,next) =>{
	if (parseInt(req.query.idTransactions)>0){
		dbHandlers.Qgen_transactions.Qupdate_Transaction(req.body,req.query.idTransactions,(err,results)=>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Database error updating transaction"});
			}else{ 
				res.status(200).json({message:"Transaction updated"})
			};
		});
	}else{
		res.status(400).json({message:"Bad request"});
	};
};


module.exports = {
	getList_Transactions,
	create_Transactions,
	delete_Transaction,
	update_Transaction
}