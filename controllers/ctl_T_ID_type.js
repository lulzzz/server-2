var dbHandlers = require("../db");

// GET request for T_identification
var getList_T_ID_type = (req,res,next)=>{
	//getById
	dbHandlers.Qgen_id_type.Qget_AllID_type(function(err,results){
		if(err){
			console.log(err);
			res.status(500).send({message:"Database error getting type id"});	
		}else if (results.length <=0){
			res.status(204).json({message:"No content"});
		}else{
			res.status(200).json(results);
		}
	});
};

//post T_id_type
var create_T_ID_type = (req,res,next) =>{
	if (req.body.ID_name){
		dbHandlers.Qgen_id_type.Qcreate_ID_type([req.body.ID_name,req.body.IMT_type,req.body.Doc_type],
						(err,results) =>{
			if(err){
				console.log(err);
				res.status(500).send({message:"Database error creating type id"});	
			}else{ 
				res.status(200).json({message:"Created type id"});
			};
		});
	}else{
		res.status(400).json({message:"Bad request"});
	};
};

//delete T_id_type
var delete_T_ID_type = (req,res,next) =>{
	if (parseInt(req.query.idT_ID_type)>0){
		dbHandlers.Qgen_id_type.Qdelete_byID_type(req.query.idT_ID_type,(err,results) =>{
			if(err){
				console.log(err);
				res.status(500).send({message:"Database error deleting id type"});
			}else{ 
				res.status(200).json({message:"Deleted type id"});
			};
		});
	}else{
		res.status(400).json({message:"Bad request"});
	};
};

//update T_id_type
var update_T_ID_type = (req,res,next) =>{
	if (parseInt(req.query.idT_ID_type)>0){
		dbHandlers.Qgen_id_type.Qupdate_ID_type(req.body,req.query.idT_ID_type,(err,results)=>{
			if(err){
				console.log(err);
				res.status(500).send({message:"Database error updating id type"});
			}else{ 
				res.status(200).json({message:"Updated type id"});
			}
		})
	}else{
		res.status(400).json({message:"Bad request"});
	};
};


module.exports = {
	getList_T_ID_type,
	create_T_ID_type,
	delete_T_ID_type,
	update_T_ID_type
}