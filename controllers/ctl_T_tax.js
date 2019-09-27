var dbHandlers = require("../db");

// GET request for tax
var getList_T_tax = (req,res,next)=>{
	//getById
	dbHandlers.Qgen_tax.Qget_AllTax(function(err,results){
		if(err){
			console.log(err);
			res.status(500).send({message:"Database error getting taxes"});	
		}else if (results.length <=0){
			res.status(204).json({message:"No content"});
		}else{
			res.status(200).json(results);
		}
	});
};

//post tax
var create_T_tax = (req,res,next) =>{
	if (parseInt(req.body.Tax)>0){
		if (req.body.Tax){
			dbHandlers.Qgen_tax.Qcreate_Tax(req.body.Tax,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).send({message:"Database error creating tax"});	
				}else{ 
					res.status(200).json({message:"Tax created"});
				};
			});	
		};
	}else{
		res.status(400).json({message:"Bad request"});
	};
};

//delete tax
var delete_T_tax = (req,res,next) =>{
	if (parseInt(req.query.idT_Tax)>0){
		dbHandlers.Qgen_tax.Qdelete_byIdTax(req.query.idT_Tax,(err,results) =>{
			if(err){
				console.log(err);
				res.status(500).send({message:"Database error deleting tax"});
			}else{ 
				res.status(200).json({message:"Tax deleted"});
			};
		});
	}else{
		res.status(400).json({message:"Bad request"});
	};
};

//update tax
var update_T_tax = (req,res,next) =>{
	if (parseInt(req.query.idT_Tax)>0){
		if (req.body.Tax){
			dbHandlers.Qgen_tax.Qupdate_byIdTax(req.body,req.query.idT_Tax,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).send({message:"Database error updating tax"});
				}else{ 
					res.status(200).json({message:"Tax updated"});
				};
			});
		};
	}else{
		res.status(400).json({message:"Bad request"});
	};
};


module.exports = {
	getList_T_tax,
	create_T_tax,
	delete_T_tax,
	update_T_tax
}