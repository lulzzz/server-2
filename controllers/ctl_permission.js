var dbHandlers = require("../db");

// GET request for school (superuser)
var getList_permissions = (req,res,next)=>{
	//getAll
	dbHandlers.Qgen_permissions.Qget_AllPermissions(function(err,results){
		if(err){
			res.status(500).send(err);
		}else if(results.length<=0){
				res.status(204).send();	
		}else{
			res.status(200).json(results);
		}
	});
};

module.exports = {
	getList_permissions
}
