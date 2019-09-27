// get all records in identification types
var Qget_AllID_type = (cb)=>{
	return myQuery('SELECT * FROM T_id_type',null,  (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in ID_type
var Qget_byIdID_type =(id, cb)=>{
	return myQuery('SELECT * FROM T_id_type WHERE idT_ID_type = ?',[id], (error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

//post T_id_type
var Qcreate_ID_type = (id,cb) =>{
	return myQuery('INSERT INTO T_id_type (ID_name,IMT_type,Doc_type) VALUES (?) ',[id], (error,results,fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

//delete T_id_type
var Qdelete_byID_type = (id,cb) =>{
	return myQuery('DELETE FROM T_id_type WHERE idT_ID_type = ?',[id],(error,results,fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

//update T_id_type
var Qupdate_ID_type = (values,id,cb) =>{
	return myQuery('UPDATE T_id_type SET ? WHERE idT_ID_type = ?',[values,id],(error,results,fields) =>{
		error ? cb(error) : cb(false,results)
	});
};


module.exports = function(myQuery){
	return {
		Qget_AllID_type,
		Qget_byIdID_type,
		Qcreate_ID_type,
		Qdelete_byID_type,
		Qupdate_ID_type
	};
};
