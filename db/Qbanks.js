// get all banks available
var Qget_AllBanks = (cb)=>{
	return myQuery('SELECT * FROM Banks',null,(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// create bank
var Qcreate_Bank = (values,cb)=>{
	return myQuery('INSERT INTO Banks (Bank_name,Description) VALUES (?)',[values],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// delete bank by id
var Qdelete_byIdBank = (id,cb)=>{
	return myQuery('DELETE FROM Banks WHERE idBanks = ?',[id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// update bank by id
var Qupdate_byIdBank = (values,id,cb)=>{
	return myQuery('UPDATE Banks SET ? WHERE idBanks = ?',[values,id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

module.exports = function(myQuery){
	return {
		Qget_AllBanks,
		Qcreate_Bank,
		Qdelete_byIdBank,
		Qupdate_byIdBank
	}
}