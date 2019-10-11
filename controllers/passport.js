var passport=require('passport');
var LocalStrategy = require('passport-local').Strategy;

const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

var dbHandlers = require('../db');
var crypto = require('crypto');

var config=require('../config.json')

var verifyPassword=(userinfo,password)=>{
	console.log("Verifying password" + JSON.stringify(userinfo));
	let temphash = crypto.pbkdf2Sync(password, userinfo.Salt, 100000, 64, 'sha512').toString('hex');
	console.log("Password hashed");
	if(userinfo.Hash===temphash){
		console.log("OK Password");
		return true;
	}else{
		console.log("Wrong Password");
		return false;
	};
};

passport.use(new LocalStrategy({
	usernameField: 'user'
	},
	function(username, password, done) {
		console.log("Getting user");
		dbHandlers.Qgen_accounts.Qget_byUserAccount(username,(err,userinfo)=>{
	    	if(err){
	    		console.log("Error getting user");
	      		return done(err);
	      	};
		    if(!userinfo){
		    	console.log("User not found");
		    	return done(null, false,{message: 'User not found'});
		   	};
		    if(!verifyPassword(userinfo,password)){
		    	return done(null, false,{message: 'Password is wrong'}); 	
		    }else{
		    	return done(null, {_id: userinfo.idAccount, user: userinfo.User});
		    };
		});
	}
));

passport.serializeUser(function(user, done) {
    //serialize by user id
    done(null, user._id)
});

passport.deserializeUser(function(id, done) {
    //find user in database again 
   	dbHandlers.Qgen_accounts.Qget_byIdAccount(id,(err,results)=>{
      if(!err){
        done(null,results);
      }else{
        done(err)
      }
    });
});