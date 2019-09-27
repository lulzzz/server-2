// get all permission available
var Qget_AllPermissions = (cb)=>{
	return myQuery('SELECT * FROM T_permission',null,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// create permission available
var Qcreate_Permissions = (action,cb)=>{
	return myQuery('INSERT INTO T_permission (Action) values (?)',[action],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// delete permission by id
var Qdelete_byIdPermissions = (id,cb)=>{
	return myQuery('DELETE FROM T_permission WHERE idT_permission=? ',[id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// update permission by id
var Qupdate_byIdPermissions = (values,id,cb)=>{
	return myQuery('UPDATE T_permission SET ? WHERE idT_permission=? ',[values,id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

module.exports = function(myQuery){
	return {
		Qget_AllPermissions,
		Qcreate_Permissions,
		Qdelete_byIdPermissions,
		Qupdate_byIdPermissions
	}
}