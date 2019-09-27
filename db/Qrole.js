// get all records in roles
var Qget_AllRoles = (cb)=>{
	return myQuery('SELECT * FROM Role ORDER BY Role_name ASC',null,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

var Qget_byIdRole = (idrole,cb)=>{
	return myQuery('SELECT * FROM Role WHERE idRole = ?',[idrole],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

// create record in roles
var Qcreate_Role = (values,cb)=>{
	return myQuery('INSERT INTO Role (Role_name,Obs) values (?)',[values],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// delete record in roles by id
var Qdelete_byIdRole = (id,cb)=>{
	return myQuery('DELETE FROM Role WHERE idRole = ?',[id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// update record in roles by id
var Qupdate_byIdRole=(id,values,cb)=>{
	console.log(values);
	return myQuery('UPDATE Role SET ? where idRole=?',[values,id],(error, results,fields)=>{
		error ? cb(error) : cb(false,results);	
	})
};

module.exports = function(myQuery){
	return {
		Qget_AllRoles,
		Qget_byIdRole,
		Qcreate_Role,
		Qdelete_byIdRole,
		Qupdate_byIdRole
	};
};