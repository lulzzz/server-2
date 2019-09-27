var dbHandlers = require("../db");
var ctl_functionality = require("./ctl_functionality");
var _=require('lodash');

// GET request for school (superuser)
var getList_AllRoles = (req,res,next)=>{
	if(req.query.idrole){
		dbHandlers.Qgen_roles.Qget_byIdRole(req.query.idrole,function(err,results){
			if(err){
				res.status(500).send(err);
			}else if(results.length<=0){
				res.status(204).send();	
			}else{
				// res.status(200).json(results);
				// TODO GET FUNCTIONALITIES
			}
		});
	}else{
		dbHandlers.Qgen_roles.Qget_AllRoles(function(err,results){
			if(err){
				res.status(500).send(err);
			}else if(results.length<=0){
				res.status(204).send();	
			}else{
				res.status(200).json(results);
			}
		});	
	}
};

var create_Roles=(req,res,next)=>{
	console.log("Creating Role");
	console.log(req.body);
	console.log("--------------------------------");
	dbHandlers.Qgen_roles.Qcreate_Role([req.body.Role_name,req.body.Obs],(err,results)=>{
		if(err){
			// fail inserting
			res.status(500).send(err);	
		}else{
			// sucess
			let tempId=results.insertId;
			console.log("Role created with ID" + tempId);
			// if (req.body.Funcionalities){
			if (req.body.list_functions){
				// ctl_functionality.create_Functionality(tempId,req.body.Funcionalities,(err,message)=>{
				ctl_functionality.create_Functionality(tempId,req.body.list_functions,(err,message)=>{
					if(err){
						// fail inserting
						dbHandlers.Qgen_roles.Qdelete_byIdRole(tempId,(err,results)=>{
							console.log("Role deleted by default");
							res.status(500).send(results);
						});		
					}else{
						// role created with all functionalities
						res.status(200).send({message:`Role ${req.body.Role_name} created.`});
					};
				});
			}else{
				res.status(200).send();	
			};
		};
	});
};

var delete_Roles=(req,res,next)=>{
	if(req.query.idRole){
		dbHandlers.Qgen_roles.Qdelete_byIdRole(req.query.idRole, function(err,results){
			if(err){
				// internal error
				return res.status(500).send(err);
			}else{
				return res.status(200).json(results);
			};
		});
	}else{
		// missing id for this request
		res.status(400).send("Missing params");	
	};
};

var update_Roles=(req,res,next)=>{
	if(req.query.idRole){
		var Params_role=_.pick(req.body,['Role_name','Obs']);
		dbHandlers.Qgen_roles.Qupdate_byIdRole(req.query.idRole,Params_role,(err,results)=>{
			if(err){
				// internal error
				return res.status(500).send(err);
			}else{
				// return res.status(200).json(results);
				if(req.body.Funcionalities){
					dbHandlers.Qgen_functionalities.Qdelete_byRoleFunctionality(req.query.idRole,
											(err,results)=>{
						if(err){
							return res.status(500).send(err);	
						}else{
							ctl_functionality.create_Functionality(req.query.idRole,req.body.Funcionalities,
											(err,message)=>{
								if (err){
									return res.status(500).send(err);	
								}else{
									res.status(200).send({message:`Role modified.`});	
								};
							});	
						};
					});
				}else{
					return res.status(200).json(results);
				};
			};	
		});
	}
}

module.exports = {
	getList_AllRoles,
	create_Roles,
	delete_Roles,
	update_Roles
}