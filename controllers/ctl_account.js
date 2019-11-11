var passport = require("passport");
var dbHandlers = require("../db");
var config=require('../config.json');
var moment = require('moment');
var _ = require('lodash');
//jwt
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var generateToken = (account)=>{
	var expire = new Date();
  	expire.setDate(expire.getDate() + 10);
  	return jwt.sign({
	    _id: account._id,
	    user: account.user,
	    exp: parseInt(expire.getTime() / 1000),
	  }, config.backend.jwt_secret);
};

var get_Accounts = (req,res,next)=>{
	dbHandlers.Qgen_accounts.Qget_AllAcounts((e,accounts)=>{
		if(e){
			console.log(e);
			return res.status(500).json({message:"Error fetching accounts"});	
		}else{
			return res.status(200).json(accounts);	
		};
	});
};

module.exports = {
	register : (req,res)=>{
		if(req.body.user && req.body.password){
			//set user's password
			let salt = crypto.randomBytes(16).toString('hex');
			let hash = crypto.pbkdf2Sync(req.body.password, salt, 100000, 64, 'sha512').toString('hex');
			//create account
			// control variables not mandatories
			let temp_idExam_center;
			temp_idExam_center=req.body.Exam_center_idExam_center;

			let user_name;
			if (req.body.User_name){
				user_name=req.body.User_name;
			}else{
				user_name=null;
			};
			let user_email;
			if (req.body.User_email){
				user_email=req.body.User_email;
			}else{
				user_email=null;
			};
			let createdate=moment().format('YYYY-MM-DD');
			dbHandlers.Qgen_exam_center.Qget_byIdExam_center(req.body.Exam_center_idExam_center,
									(error,exam_center)=>{
				if (error){
					console.log(error);
					res.status(500).json({message:"Error searching exam center"});
				}else{
					let School_idSchool=_.pick(req.body,['School_idSchool']);
					if (_.isInteger(School_idSchool)){
						dbHandlers.Qgen_accounts.Qcreate_Account([req.body.user,hash,salt,
										user_name,user_email,1,createdate,null,1,
										req.body.Exam_center_idExam_center,exam_center[0].Exam_center_name,
										req.body.role.idRole,req.body.School_idSchool],(e,r)=>{
							if(e){
								if(e.code == "ER_DUP_ENTRY"){
									res.status(400).json({message:"User already exists"});
								}else{
									console.log(e);
									res.status(500).json({message:"Error creating account"})
								}
							}else{
								console.log("Account created");
								res.status(200).json({token: generateToken({_id: r.insertId, user: req.body.user, idExam_center:temp_idExam_center})})
							};
						});
					}else{
						dbHandlers.Qgen_accounts.Qcreate_Account([req.body.user,hash,salt,
										user_name,user_email,1,createdate,null,1,
										req.body.Exam_center_idExam_center,exam_center[0].Exam_center_name,
										req.body.role.idRole,null],(e,r)=>{
							if(e){
								if(e.code == "ER_DUP_ENTRY"){
									res.status(400).json({message:"User already exists"});
								}else{
									console.log(e);
									res.status(500).json({message:"Error creating account"})
								}
							}else{
								console.log("Account created");
								res.status(200).json({token: generateToken({_id: r.insertId, user: req.body.user, idExam_center:temp_idExam_center})})
							};
						});
					};
				};
			});
		}else{
			res.status(400).json({message: "Bad params."});	
		};
	},
	login : (req,res)=>{
		console.log("Received login");
		if(req.body.user && req.body.password){
			console.log("Log In");
			passport.authenticate('local', (e, account, info)=>{
				if(e){
					console.log("Error authenticating");
					// res.status(404).json(e);
					res.status(404).json({message:"Error authenticating"});
				}
				if(account){
					console.log("Password valid");
					var token = generateToken(account);
					dbHandlers.Qgen_accounts.Qget_byUserAccount(req.body.user,(err,acc)=>{
						// console.log(acc.Exam_center_idExam_center)
						
						if (err){
							res.status(500).json({message:"Database error finding user"});	
						}else{
							// GET permissions to send to client
							dbHandlers.Qgen_accounts.Qget_byUserPermissions(req.body.user,(err,results)=>{
							    let parsedResults = JSON.parse(JSON.stringify(results));
							    let outerArraySize = parsedResults.length;
								let actions=[];
							    for (let outerIndex = 0; outerIndex < outerArraySize; outerIndex++) {
									actions[outerIndex]=results[outerIndex].action + "_" + results[outerIndex].Resource_name;
								};
								console.log({user:req.body.user,
											idExam_center:acc.Exam_center_idExam_center,
											Exam_center_name:acc.Exam_center_name,
											idSchool:acc.School_idSchool,
											Functionality:actions,
											token: token});	
								return res.status(200).json({user:req.body.user,
											idExam_center:acc.Exam_center_idExam_center,
											Exam_center_name:acc.Exam_center_name,
											idSchool:acc.School_idSchool,
											Functionality:actions,
											token: token});
		    				});	
						};
					});	
				}else{
					console.log(info);
					return res.status(401).json({message:"Wrong Credentials"});
				};
			})(req,res);
		};
	},
	get_Accounts
}

	//   	var keys = Object.keys(parsedResults[outerIndex]);
	//   	console.log("innerArraySize "+ keys.length);
		// for (var innerIndex = 0; innerIndex < keys.length; innerIndex++) {
		  	// console.log(JSON.stringify(parsedResults[keys[i]]));
	//     var innerArraySize = parsedResults[outerIndex].length;
	//     console.log("innerArraySize "+ innerArraySize);
	//     console.log("innerArray "+ JSON.stringify(parsedResults[outerIndex]));
	//     for (var innerIndex = 0; innerIndex < innerArraySize; ++innerIndex)
	//         console.log("ACTION: " + parsedResults[outerIndex][innerIndex].action);
	// }
	// console.log("----------------------");
	// }
	// Object.keys(results).forEach(function(key) {
	//      var row = results[key];
	//      console.log(JSON.stringify(row.name))
	//    });