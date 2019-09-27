// get all resources available
var Qget_AllPermissions = (cb)=>{
	return myQuery('SELECT * FROM t_permission',null,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byRoleFunctionality=(idrole,cb)=>{
	return myQuery('SELECT * FROM functionality WHERE Role_idRole=?',[idrole],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});		
};

var Qcreate_Functionality=(values,cb)=>{
	console.log ("Qvalues : " + values);
	return myQuery('INSERT INTO Functionality (T_resource_idT_resource,T_permission_idT_permission,Role_idRole) '+
							'values ?',[values],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});		
};

var Qdelete_Functionality=(id,cb)=>{
	return myQuery('DELETE FROM Functionality WHERE idFunctionality=?',[id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});		
};

var Qdelete_byRoleFunctionality=(idrole,cb)=>{
	return myQuery('DELETE FROM Functionality WHERE Role_idRole=?',[idrole],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});		
};


module.exports = function(myQuery){
	return {
		Qget_AllPermissions,
		Qget_byRoleFunctionality,
		Qcreate_Functionality,
		Qdelete_Functionality,
		Qdelete_byRoleFunctionality
	};
};







// SELECT t_permission.action, t_resource.Resource_name FROM
//     t_permission,
//     t_resource,
//     functionality,
//     role,
//     account
// WHERE
//     t_permission.idt_permission = functionality.T_permission_idT_permission
//         AND t_resource.idT_resource = functionality.T_resource_idT_resource
//         AND functionality.Role_idRole = role.idRole
//         AND account.Role_idRole = role.idRole
//         AND account.User = 'admin'