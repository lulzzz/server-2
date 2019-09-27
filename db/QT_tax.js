// get all tax available
var Qget_AllTax = (cb)=>{
	return myQuery('SELECT * FROM T_Tax',null,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// create tax
var Qcreate_Tax = (values,cb)=>{
	return myQuery('INSERT INTO T_Tax (Tax) VALUES (?)',[values],(error, results, fields)=>{
		error ? cb(error) : cb(false,results[0]);
	});
};

// delete tax by id
var Qdelete_byIdTax = (id,cb)=>{
	return myQuery('DELETE FROM T_Tax WHERE idT_Tax=? ',[id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results[0]);
	});
};

// update tax by id
var Qupdate_byIdTax = (values,id,cb)=>{
	return myQuery('UPDATE T_Tax SET ? WHERE idT_Tax=? ',[values,id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results[0]);
	});
};

module.exports = function(myQuery){
	return {
		Qget_AllTax,
		Qcreate_Tax,
		Qdelete_byIdTax,
		Qupdate_byIdTax
	}
}