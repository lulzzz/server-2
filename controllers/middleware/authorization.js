var dbHandlers = require("../db");
var jwt=require("express-jwt");
var config=require('../../config.json');

// middleware for doing role-based permissions
export default function permit(req,resource){
	// const isAllowed = role => allowed.indexOf(role) > -1;
	var decoded = jwt_decode(req.token);

	dbHandlers.Qgen_accounts.Qget_byUserPermissions(req.body.user,(err,results)=>{
	    let parsedResults = JSON.parse(JSON.stringify(results));
	    let outerArraySize = parsedResults.length;
		let actions=[];
	    for (let outerIndex = 0; outerIndex < outerArraySize; outerIndex++) {
			actions[outerIndex]=results[outerIndex].action + "_" + results[outerIndex].Resource_name;
		};
		res.status(200).json({user:req.body.user,Functionality:actions,token: token});	
	});
}

	// // return a middleware
	// return (request, response, next) => {


	// 	if (request.user && isAllowed(request.user.role))
	// 	  next(); // role is allowed, so continue on the next middleware
	// 	else {
	// 	  response.status(403).json({message: "Forbidden"}); // user is forbidden
	// 	}
	// }
