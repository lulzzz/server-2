var jwt=require("express-jwt");
var config=require('../../config.json');

module.exports=jwt({secret:config.backend.jwt_secret})
.unless(
	{
		path:["/api/login","/api/registo","/api/teste","/api/easyPay"]
	}
)