// get all records in balance
var Qget_AllBalances = (cb)=>{
	return myQuery('SELECT Balance.*, school.permit FROM Balance '+
				'LEFT JOIN school ON Balance.School_idSchool=School.idSchool '+
				'ORDER BY school.permit',null,(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all records in balance by permit
var Qget_BySchoolBalances = (idSchool,cb)=>{
	return myQuery('SELECT Balance.* FROM Balance WHERE Balance.School_idSchool=?',
				[idSchool],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all records in balance by permit
var Qcreate_Balances = (idSchool,cb)=>{
	return myQuery('INSERT INTO Balance (Balance_count,School_idSchool) '+
				'values (1,?)',[idSchool],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all records in balance by permit
var Qpatch_Balances = (count,id,cb)=>{
	return myQuery('UPDATE Balance SET Balance_count=? WHERE idBalance=?',
					[count,id],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

module.exports = function(myQuery){
	return {
		Qget_AllBalances,
		Qget_BySchoolBalances,
		Qcreate_Balances,
		Qpatch_Balances
	}
}