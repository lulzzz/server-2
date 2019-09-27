// get all resources available
var Qget_AllResources = (cb)=>{
	return myQuery('SELECT * FROM t_resource',null,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// create resources
var Qcreate_Resources = (name,cb)=>{
	return myQuery('INSERT INTO T_resource (Resource_name) values (?)',[name],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// delete resources by id
var Qdelete_byIdResources = (id,cb)=>{
	return myQuery('DELETE FROM T_resource WHERE idT_resource=? ',[id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// update resources by id
var Qupdate_byIdResources = (values,id,cb)=>{
	return myQuery('UPDATE T_resource SET ? WHERE idT_resource=? ',[values,id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

module.exports = function(myQuery){
	return {
		Qget_AllResources,
		Qcreate_Resources,
		Qdelete_byIdResources,
		Qupdate_byIdResources
	}
}