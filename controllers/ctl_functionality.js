var dbHandlers = require("../db");

var testfunc=(req,res,next)=>{

	var T_resource_idT_resource;
	var T_permission_idT_permission;
	let resource_size = req.body.length;
	var record=[];

	// console.log("OBS " +req.body.obs);
	// 			if(req.body.role && req.body.obs){
	// 				console.log("NAO Existe os dois params " );
	// 			}else{
	// 				console.log("EXISTE os dois params " );
	// 			};

	// console.log("Received TEST");
	// console.log(req.body);
	// console.log("--------------------------------");
	// console.log("list_functions parse");
	// console.log(req.body.list_functions);
	// console.log("--------------------------------");
	// console.log("list_functions parse length");
	// console.log(req.body.list_functions.length);
	// console.log("--------------------------------");
	// console.log("list_functions[0].permissions parse");
	// console.log(req.body.list_functions[0].permissions);
	// console.log("--------------------------------");
	// console.log("list_functions[0].permissions length");
	// console.log(req.body.list_functions[0].permissions.length);
	// console.log("--------------------------------");
	// console.log("list_functions[0].permissions[0] ID");
	// console.log(req.body.list_functions[0].permissions[0].id);
	// console.log("--------------------------------");
	// console.log("list_functions[0].permissions[0] ID");
	// console.log(req.body.list_functions[0].permissions[0].id);
	// console.log("--------------------------------");
	// console.log("list_functions[0].permissions[0].valor.value GET VALUE");
	// console.log(req.body.list_functions[0].permissions[0].valor.value);
	// console.log("--------------------------------");
	// console.log(req.body.list_functions[0].permissions[2].valor.value);
	for (let index = 0; index < resource_size; index++) {
		// record.push([body[index].T_resource_idT_resource,body[index].T_permission_idT_permission,id_role]);
		let permit_size = req.body[index].permissions.length;
		for (let innerindex=0;innerindex<permit_size;innerindex++){
			T_resource_idT_resource=req.body[0].resource
			T_permission_idT_permission=req.body[0].permissions[0].id
			if (req.body[0].permissions[0].valor.value){
				record.push([{T_resource_idT_resource},{T_permission_idT_permission}]);		
			};
		};
 	};
	console.log(record);
};

var create_Functionality=(id_role,body,cb)=>{
	console.log("Creating functionality");
	var T_resource_idT_resource;
	var T_permission_idT_permission;
	let resource_size = body.length;
	var record=[];

	for (let index = 0; index < resource_size; index++) {
		// record.push([body[index].T_resource_idT_resource,body[index].T_permission_idT_permission,id_role]);
		let permit_size = body[index].permissions.length;
		for (let innerindex=0;innerindex<permit_size;innerindex++){
			T_resource_idT_resource=body[0].resource
			T_permission_idT_permission=body[0].permissions[0].id
			if (body[0].permissions[0].valor.value){
				record.push([{T_resource_idT_resource},{T_permission_idT_permission}]);		
			};
		};
	 };
	dbHandlers.Qgen_functionalities.Qcreate_Functionality(record,function(err,results){
		if(err){
			cb("Error inserting permissions");
		}else{
			cb(null,results);
		};
	});
};

module.exports = {
	create_Functionality,
	testfunc
}

// {
// "role_name":"teste",
// "Obs":"asfsdf",
// "Funcionalities":[{
// "T_resource_idT_resource":1,
// "T_permission_idT_permission":1
// },
// {
// "T_resource_idT_resource":1,
// "T_permission_idT_permission":2
// }]
// }




