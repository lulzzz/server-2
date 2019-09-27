var dbHandlers = require("../db");

// GET request for banks
var getList_Banks = (req,res,next)=>{
	dbHandlers.Qgen_bank.Qget_AllBanks(function(err,results){
		if(err){
			console.log(err);
			res.status(500).json({message:"Database error getting banks"});	
		}else if (results.length <=0){
			res.status(204).json({message:"No content"});
		}else{
			res.status(200).json(results);
		};
	});
};

//post banks
var create_Bank = (req,res,next) =>{
	if (req.body.Bank_name){
		dbHandlers.Qgen_bank.Qcreate_Bank([req.body.Bank_name,req.body.Description],(err,results)=>{
			if(err){
				res.status(500).json({message:"Database error creating bank"});	
			}else{ 
				res.status(200).json({message:"Bank created"});
			};
		});
	}else{
		res.status(400).json({message:"Bad request"});
	};
};

//delete banks
var delete_Bank = (req,res,next) =>{
	if (parseInt(req.query.idBanks)>0){
		dbHandlers.Qgen_bank.Qdelete_byIdBank(req.query.idBanks,(err,results) =>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Database error deleting bank"});
			}else{ 
				res.status(200).json({message:"Bank deleted"});
			};
		});
	}else{
		res.status(400).json({message:"Bad request"});
	};
};

//update banks
var update_Bank = (req,res,next) =>{
	if (parseInt(req.query.idBanks)>0){
		if (req.body.Bank_name || req.body.Description){
			dbHandlers.Qgen_bank.Qupdate_byIdBank(req.body,req.query.idBanks,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Database error updating bank"});
				}else{ 
					res.status(200).json({message:"Bank updated"})
				};
			});
		};
	}else{
		res.status(400).json({message:"Bad request"});
	};
};

module.exports = {
	getList_Banks,
	create_Bank,
	delete_Bank,
	update_Bank
}