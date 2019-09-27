// get all records in delegations
var Qget_AllDelegations = (cb)=>{
	return myQuery('SELECT * FROM T_delegation ORDER BY Delegation_name ASC',null,  (error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get record by id in delegations
var Qget_byIdDelegations =(id, cb)=>{
	return myQuery('SELECT * FROM T_delegation WHERE idDelegation = ?',[id], (error, results, fields) =>{
		error ? cb(error) : cb(false,results);
	});
};

// create new Delegation
var Qcreate_Delegation = (values,cb)=>{
	console.log(values)
	return myQuery('INSERT INTO T_delegation (Delegation_name,Delegation_num,Delegation_short) '+
						'VALUES (?)',[values],(error,results,fields)=>{
    	error ? cb(error) : cb(false,results);
  	});
};

// delete Delegation by id
var Qdelete_Delegation = (id,cb)=>{
	return myQuery('DELETE FROM T_delegation WHERE idDelegation = ?',[id],(error,results,fields)=>{
    	error ? cb(error) : cb(false,results);
  	});
};

// Update Delegation by id
var Qupdate_ById_Delegation = (values,id,cb) =>{
  return myQuery('UPDATE T_delegation SET ? WHERE idDelegation = ?',[values,id],(error,results,fields)=>{
    error ? cb(error) : cb(false,results);
  });
};

module.exports = function(myQuery){
	return {
		Qget_AllDelegations,
		Qget_byIdDelegations,
		Qcreate_Delegation,
		Qdelete_Delegation,
		Qupdate_ById_Delegation
	};
};