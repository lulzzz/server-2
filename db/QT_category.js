// get all records in types of categories
var Qget_AllCategories = (cb)=>{
	return myQuery('SELECT * FROM type_category ORDER BY Category ASC',null,  (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in ID_type
var Qget_byIdCategories =(id, cb)=>{
	return myQuery('SELECT * FROM type_category WHERE idType_category = ?',[id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

//post categories by name
var Qcreate_Category = (values,cb) =>{
	return myQuery('INSERT INTO type_category (Category) VALUES (?)', [values],(error,results,fields)=>{
		error ? cb(error) : cb(false,results)
	});
};

//delete category by Id
var Qdelete_Category = (id,cb) =>{
	return myQuery('DELETE FROM type_category WHERE idType_category = ?',[id],(error,results,fields)=>{
		error ? cb(error) : cb(false,results)
	});
};

//update category by id and new name
var Qupdate_Category = (id,values,cb) =>{
	return myQuery('UPDATE type_category SET Category = ? WHERE idType_category = ?',[values,id],
						(error,results,fields)=>{
		error ? cb(error) : cb(false,results)
	});
};

module.exports = function(myQuery){
	return {
		Qget_AllCategories,
		Qget_byIdCategories,
		Qcreate_Category,
		Qdelete_Category,
		Qupdate_Category
	};
};