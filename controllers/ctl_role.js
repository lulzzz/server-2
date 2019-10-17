var dbHandlers = require("../db");
var ctl_functionality = require("./ctl_functionality");
var _=require('lodash');

// GET request for school (superuser)
var getList_AllRoles = (req,res,next)=>{
	if(req.query.idrole){
		dbHandlers.Qgen_roles.Qget_byIdRole(req.query.idrole,(err,results)=>{
			if(err){
				console.log(err);
				return res.status(500).json({message:"Database error fetching role"});
			}else if(results.length<=0){
				return res.status(204).json({message:"No role found"});	
			}else{
				// TODO GET FUNCTIONALITIES
				



				return res.status(200).json(results);
			};
		});
	}else{
		dbHandlers.Qgen_roles.Qget_AllRoles((err,results)=>{
			if(err){
				console.log(err);
				return res.status(500).json({message:"Database error fetching roles"});
			}else if(results.length<=0){
				return res.status(204).json({message:"No roles found"});	
			}else{
				return res.status(200).json(results);
			};
		});	
	};
};

var create_Roles=(req,res,next)=>{
	dbHandlers.Qgen_roles.Qcreate_Role([req.body.Role_name,req.body.Obs],(err,results)=>{
		if(err){
			// fail inserting
			console.log(err);
			return res.status(500).json({message:"Database error creating role"});	
		}else{
			// sucess
			let tempId=results.insertId;
			// if (req.body.Funcionalities){
			if (req.body.list_functions){
				// ctl_functionality.create_Functionality(tempId,req.body.Funcionalities,(err,message)=>{
				ctl_functionality.create_Functionality(tempId,req.body.list_functions,(err,message)=>{
					if(err){
						// fail inserting
						dbHandlers.Qgen_roles.Qdelete_byIdRole(tempId,(err,results)=>{
							console.log("Role deleted by default");
							return res.status(500).json({message:"Database error creating functionalities in role"});
						});		
					}else{
						// role created with all functionalities
						return res.status(200).json({message:`Role ${req.body.Role_name} created.`});
					};
				});
			}else{
				return res.status(200).json({message:`Role ${req.body.Role_name} created.`});	
			};
		};
	});
};

var delete_Roles=(req,res,next)=>{
	if(req.query.idRole){
		dbHandlers.Qgen_roles.Qdelete_byIdRole(req.query.idRole, (err,results)=>{
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:"Database error deleting role"});
			}else{
				return res.status(200).json({message:"Role deleted"});
			};
		});
	}else{
		// missing id for this request
		return res.status(400).json({message:"Bad request"});	
	};
};

var update_Roles=(req,res,next)=>{
	if(req.query.idRole){
		var Params_role=_.pick(req.body,['Role_name','Obs']);
		dbHandlers.Qgen_roles.Qupdate_byIdRole(req.query.idRole,Params_role,(err,results)=>{
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json("Database error updating role");
			}else{
				// return res.status(200).json(results);
				if(req.body.Funcionalities){
					dbHandlers.Qgen_functionalities.Qdelete_byRoleFunctionality(req.query.idRole,
											(err,results)=>{
						if(err){
							console.log(err);
							return res.status(500).json({message:"Database error deleting previous roles"});	
						}else{
							ctl_functionality.create_Functionality(req.query.idRole,req.body.Funcionalities,
											(err,message)=>{
								if (err){
									console.log(err);
									return res.status(500).json({message:"Database error updating role"});	
								}else{
									return res.status(200).json({message:`Role modified.`});	
								};
							});	
						};
					});
				}else{
					return res.status(200).json({message:`Role modified.`});
				};
			};	
		});
	}else{
		// missing id for this request
		return res.status(400).json({message:"Bad request"});	
	};
};

module.exports = {
	getList_AllRoles,
	create_Roles,
	delete_Roles,
	update_Roles
}