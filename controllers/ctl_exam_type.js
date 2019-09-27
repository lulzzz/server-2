var dbHandlers = require("../db");
const validator = require('node-input-validator');
let schema=require('../db/schemas/schema_exam_type.json');
var ctl_exam_price = require("./ctl_exam_price");
var config=require('../config.json');
var request= require('request');

// var _=require('lodash');
// var bodyParser = require('body-parser');

// GET request for types of exam type
var getList_Exam_type = (req,res,next)=>{
	if(parseInt(req.query.IdExam_type)>0){
		//getById
		dbHandlers.Qgen_exam_type.Qget_byIdExam_type(req.query.IdExam_type,(err,results)=>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Database error getting exam type"});
			}else{
				res.status(200).json(results);
			}
		});
	}else{
		//getAll
		dbHandlers.Qgen_exam_type.Qget_AllExam_type((err,results)=>{
			if(err){
				console.log(err);
				res.status(500).send({message:"Database error getting exam type"});
			}else{
				res.status(200).json(results);
			}
		});
	};	
};

// POST request for exam type
var createExam_type=(req,res,next)=>{
	// Start promise for schema 
	let val = new validator(req.body,schema);
	val.check().then((matched)=>{
	//Different schema
		if (!matched){
			console.log(val.errors);
			return res.status(422).json({message:"fail the schema test"}); 
		};
		// console.log(req.body);
		if(req.body.Type_category_idType_category){
			console.log("Creating Exam type!");
			dbHandlers.Qgen_exam_type.Qcreate_Exam_type([req.body.Exam_type_name,req.body.Short,
									req.body.Description,req.body.Has_route,req.body.Num_examiners,
									req.body.Num_students,req.body.Duration,
									req.body.Minimun_age,req.body.Has_license,req.body.Has_Pair,
									req.body.Final_exam,req.body.Code,req.body.High_way,
									req.body.Condicioned_route,req.body.Type_category_idType_category],
									(err,results)=>{
				if(err){
					// fail inserting
					console.log(err);
					res.status(500).json({message:"Error creating exam type"});
				}else{
					// sucess
					// Gets the ID of the new Exam_type created
					let tempId=results.insertId;
					ctl_exam_price.createExam_price([req.body.exam_type_letter,req.body.exam_type_code,req.body.Price,req.body.Price_no_associated,
										req.body.exam_tax_letter,req.body.exam_tax_code,req.body.exam_tax_price,req.body.emit_drive_license_letter,
										req.body.emit_drive_license_code,req.body.emit_drive_license_price],
										tempId,req.body.T_Tax_idT_Tax,(err,results)=>{
						if(err){
							// fail inserting
							console.log(err);
							dbHandlers.Qgen_exam_type.Qdelete_byIdExam_type(tempId,(err,results)=>{
								console.log("Exam type deleted by default");
								res.status(500).json({message:"Error creating exam price"});
							});		
						}else{
							// create exam type in invoice api
							let product_json={
									productType: req.body.exam_type_letter,
								    code: req.body.Code,
								    description: req.body.Description,
								};
							request({
								url:config.api_invoice.url_product,
								method: 'POST',
								json:product_json
								},(error, response, body)=>{
									if (error){
										// log api error received
									}else{
										// sucess
										console.log("Product created");
									};
								});
							res.status(200).json({message:"Exam type created"});
						};
					});
				};
			});
		}else{
			res.status(422).json({message:'Missing params'});
		};
	});
};

// DELETE request for exam type
var deleteExam_type = (req,res,next)=>{
	if(parseInt(req.query.idExam_type)>0){
		dbHandlers.Qgen_exam_type.Qdelete_byIdExam_type(req.query.idExam_type, (err,results)=>{
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:'Database error deleting exam type'});
			}else{
				return res.status(200).json(results);
			};
		});
	}else{
		// missing id for this request
		res.status(400).json({message:"Missing params"});	
	};
};

// UPDATE request for exam type
var updateExam_type = (req,res,next)=>{
	if(parseInt(req.query.idExam_type)>0){	
		// This body can contain data for 2 tables
		// Need to parse the body to 2
		var Params_Exam_type=_.pick(req.body,['Exam_type_name','Short','Description','Has_route',
									'Num_examiners','Num_students','Duration','Minimun_age',
									'Has_license','Has_Pair','Final_exam','Code','High_way','Condicioned_route',
									'Type_category_idType_category']);
		dbHandlers.Qgen_exam_type.Qupdate_byIdExam_type(req.query.idExam_type, Params_Exam_type,
								(err,results)=>{
			if(err){
				// internal error
				console.log(err);
				return res.status(500).json({message:"Database error updating the exam type"});
			}else{
				if(req.query.idExam_price && (req.body.Price || req.body.Price_no_associated
									|| req.body.Tax || req.body.Tax_emit_drive_license)){
					var Params_Exam_price =_.pick(req.body,['Price','Price_no_associated','Tax',
									'Tax_emit_drive_license']);
					ctl_exam_price.updateExam_price(req.query.idExam_price,Params_Exam_price, 
									function(err,results){
						if (err){
							console.log(err);
							return res.status(500).json({message:"Database error updating exam price"});
						}else{
							return res.status(200).json("Exam type updated");
						};
					});
				}else{
					return res.status(200).json("Exam type updated");
				};
			};
		});
	}else{
		// missing id for this request
		return res.status(400).json({message:"Bad request"});
	};
};

module.exports = {
	getList_Exam_type,
	createExam_type,
	deleteExam_type,
	updateExam_type
}