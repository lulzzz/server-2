var config=require('../config.json');
var dbHandlers = require("../db");
var _ = require('lodash');
var moment = require('moment');
var request= require('request');
var fs=require('fs');

// GET request for Payments
var getList_Payments = (req,res,next)=>{
	if (req.params.idExam_center>0 && req.query.saft===undefined){
		if (req.query.idPayment){
			// complete payment for given id
			dbHandlers.Qgen_payment.Qget_byId_Payments(req.query.idPayment,(err,payment)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting payment by id"});
				}else if(payment.length<=0){
					res.status(204).json({message:"No content"});
				}else{
					dbHandlers.Qgen_pendent_payments.Qget_byIdPayment_PendentPayment(req.query.idPayment,
								(err,pendents)=>{
						if(err){
							console.log(err);
							res.status(500).json({message:"Error getting pendent payments for payment"});	
						}else{
							dbHandlers.Qgen_transactions.Qget_ByPayment_Transactions(req.query.idPayment,
									(err,transactions)=>{
								if (err){
									console.log(err);
									res.status(500).json({message:"Error getting transactions for payment"});	
								}else{
									arr_response=[];
									arr_response.push(payment);
									arr_response.push(pendents);
									arr_response.push(transactions);
									res.status(200).json(arr_response);
								};
							});	
						};
					});
				};
			});	
		}else{
			// all payments for given exam center
			dbHandlers.Qgen_payment.Qget_AllByExam_Center_Payments(req.params.idExam_center,(err,results)=>{
				if(err){
					console.log(err);
					res.status(500).json({message:"Error getting all payments in exam center"});
				}else if(results.length<=0){
					res.status(204).json({message:"No content"});
				}else{
					res.status(200).json(results);
				};
			});			
		};
	}else if (req.params.idExam_center=0 && req.query.saft===undefined){
		// all payments
		dbHandlers.Qgen_payment.Qget_AllPayments((err,results)=>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Error getting all payments"});
			}else if(results.length<=0){
				res.status(204).json({message:"No content"});
			}else{
				res.status(200).json(results);
			};
		});		
	}else if (req.query.saft){
		// SAFT for entire company
		console.log("SAFT request");
		// console.log(config.api_invoice.url_saft+"?year="+req.query.year+"&month="+req.query.month);
		request({
			url:config.api_invoice.url_saft+"?year="+req.query.year+"&month="+req.query.month
		},(error, response, body)=>{
			console.log("SAFT received");
			res.set('Content-Type','text/xml');
			return res.status(200).send(body);
		});	
	}else{
		return res.status(400).json({message:"Bad request"});
	}
};

// Promise associate transactions to payment
var P_associate_Trans= async (id,idpayment) => {
	// console.log("transactions " + values);
	return await new Promise((resolve,reject)=>{
		try{
			dbHandlers.Qgen_transactions.Qupdate_Payment_Transaction(id,idpayment,(err,trans)=>{
				if (err){
					console.log(err);
					reject(err);
				}else{
					// console.log(values);
					console.log("patch transactions");
	  				resolve();
				};
	  		});		
		}catch (err){
			console.log(err);
			return reject(err);
		};
	});
};

// Promise associate pendent payment to payment
var P_associate_PendP= async (id,idpayment) => {
	// console.log("pendent " + values);
	return await new Promise((resolve,reject)=>{
		try{
			dbHandlers.Qgen_pendent_payments.Qpatch_Payment_PendentPayment(id,idpayment,(err,pendent)=>{
				if (err){
					console.log(err);
					reject(err);
				}else{
					// console.log(values);
					console.log("patch pendent ");
	  				resolve();
				};
	  		});		
		}catch (err){
			console.log(err);
			return reject(err);
		};
	});
};

// create new Payment
var create_Payment = (req,res,next)=>{
	if(!req.query.search){
		if (req.body.Payment_date && req.body.Total_value){
			dbHandlers.Qgen_payment.Qcreate_Payment([req.body.Payment_date,req.body.Total_value],(err,results)=>{
				if (err){
					console.log(err);
					res.status(500).json({message:"Error creating Payment"});	
				}else{
					var idpayment=results.insertId;
					var array_P_trans=[];
					var array_P_PendP=[];
					req.body.Checks.forEach((element)=>{
						array_P_trans.push(P_associate_Trans(element,idpayment));
					});
					Promise.all(array_P_trans)
						.then(()=>{
							// res.status(200).send({message:"Pautas created"});	
						}).catch((err)=>{
			                // log that I have an error, return the entire array;
			                console.log(err);
			                res.status(500).json({message:"Database error creating payment in transactions"});
	    				});
					req.body.Exams.forEach((element)=>{
						// console.log(element);
						array_P_PendP.push(P_associate_PendP(element,idpayment));
					});
					Promise.all(array_P_PendP)
	    				.then(()=>{
							res.status(200).json({message:"Payment created"});	
						}).catch((err)=>{
			                // log that I have an error, return the entire array;
			                console.log(err);
			                res.status(500).json({message:"Database error creating payment in pendent payments"});
	    				});
				};
			});
		}else{
			res.status(400).send({message:"Bad request"});	
		};
	}else{
		var conditions = ['Transactions.Exam_center_idExam_center = ?'];
		var values = [req.body.Exam_center_idExam_center];
		var conditionsStr;

		if (typeof req.body.Transaction_num !== 'undefined') {
			conditions.push('Transactions.Transaction_num = ?');
			values.push(req.body.Transaction_num);
		};
		if (typeof req.body.Banks_idBanks !== 'undefined') {
			conditions.push('Transactions.Banks_idBanks = ?');
			values.push(req.body.Banks_idBanks);
		};
		if (typeof req.body.Payment_method_idPayment_method !== 'undefined') {
			conditions.push('Transactions.Payment_method_idPayment_method = ?');
			values.push(req.body.Payment_method_idPayment_method);
		};
		if (typeof req.body.Transaction_date !== 'undefined') {
			conditions.push('Transactions.Transaction_date = ?');
			values.push(req.body.Transaction_date);
		};
		if (typeof req.body.Payment_date !== 'undefined') {
			conditions.push('Payment.Payment_date = ?');
			values.push(req.body.Payment_date);
		};
		if (typeof req.body.Transaction_value !== 'undefined') {
			conditions.push('Transactions.Transaction_value = ?');
			values.push(req.body.Transaction_value);
		};
		if (typeof req.body.T_Status_check_idT_Status_check !== 'undefined') {
			conditions.push('Transactions.T_Status_check_idT_Status_check = ?');
			values.push(req.body.T_Status_check_idT_Status_check);
		};
		if (typeof req.body.Check_date !== 'undefined') {
			conditions.push('T_Status_check.Check_date = ?');
			values.push(req.body.Check_date);
		};
		if (typeof req.body.Permit !== 'undefined') {
			conditions.push('School.Permit = ?');
			values.push(req.body.Permit);
		};
		if (typeof req.body.School_name !== 'undefined') {
			conditions.push('School.School_name LIKE ?');
			values.push("%"+req.body.School_name+"%");
		};
		// concateneate query
		conditionsStr=conditions.length ? conditions.join(' AND ') : '1';
		dbHandlers.Qgen_payment.Qget_search(conditionsStr,values,(err,results)=>{
			if (err){
				console.log(err);
				res.status(500).json({message:"Error getting advance search"});	
			}else{
				res.status(200).json(results);	
			};	
		});
	};
};

// erase payment id from transactions
var P_delete_Transactionpayment = async (values) => {
	return await new Promise((resolve,reject) => {
		try{
			dbHandlers.Qgen_transactions.Qupdate_Payment_Transaction([values,null],(err,results)=>{
				if (err){
					console.log(err);
					reject(err);
				}else{
	  				resolve();
				};
	  		});		
		}catch (err){
			console.log(err);
			return reject(err);
		};
	});
};

// erase payment id from pendent payments
var P_delete_Pendentpayment= async (values) => {
	return await new Promise((resolve,reject) => {
		try{
			dbHandlers.Qgen_transactions.Qpatch_Payment_PendentPayment([values,null],(err,results)=>{
				if (err){
					console.log(err);
					reject(err);
				}else{
	  				resolve();
				};
	  		});		
		}catch (err){
			console.log(err);
			return reject(err);
		};
	});
};

// Delete Payment by id
var delete_Payment = (req,res,next) =>{
	if (parseInt(req.query.idPayment)>0){
		// handle pendent payments
		dbHandlers.Qgen_pendent_payments.Qget_byIdPayment_PendentPayment(req.query.idPayment,
					(err,results) =>{
			if (err){
				console.log(err);
				return res.status(500).json({message:"Database error deleting payment"});
			}else if(results.length<=0){
				//No pendents found 
			}else{
				var array_P_Pendent=[];
				results.forEach((element)=>{
					array_P_Pendent.push(P_delete_Pendentpayment(element.idPendent_payments));
				});
				Promise.all(array_P_Pendent)
    				.then(()=>{
						// all deleted 
					}).catch((err)=>{
		                // log that I have an error, return the entire array;
		                console.log(err);
		                return res.status(500).json({message:"Database error deleting payment from pendent payments"});
    				});	
			};
		});
		// handle transactions
		dbHandlers.Qgen_transactions.Qget_ByPayment_Transactions(req.query.idPayment,
					(err,results) =>{
			if (err){
				console.log(err);
				return res.status(500).json({message:"Database error deleting payment"});
			}else if(results.length<=0){
				//No pendents found 
			}else{
				var array_P_Transaction=[];
				results.forEach((element)=>{
					array_P_Transaction.push(P_delete_Transactionpayment(element.idPendent_payments));
				});
				Promise.all(array_P_Transaction)
    				.then(()=>{
						// all deleted
					}).catch((err)=>{
		                // log that I have an error, return the entire array;
		                console.log(err);
		                return res.status(500).json({message:"Database error deleting payment from transactions"});
    				});	
			};
		});
		dbHandlers.Qgen_payment.Qdelete_Payment(req.query.idPayment,(err,results)=>{
			if(err){
				console.log(err);
				return res.status(500).json({message:"Database error deleting payment"});
			}else{ 
				return res.status(200).json({message:"Payment deleted"});
			};
		});
	}else{
		return res.status(400).json({message:"Bad request"});
	};
};

///////////////////////////////////////////////////////////////////////////////////////
// promise to get pending invoices
var P_get_pending_invoice = async (idExam_center)=>{
	return await new Promise((resolve,reject) => {
		try{
			dbHandlers.Qgen_payment.Qget_Payments_without_invoice(idExam_center,(e,payments)=>{
				if (e){
					console.log(e);
					// return res.status(500).json({message:"Database error getting payments to be invoiced"});
					reject({message:"Database error getting payments to be invoiced"});
				}else if (payments.length<=0){
					// return res.status(204).json({message:"No payments to be invoiced"});
					resolve(null);	
				}else{
					resolve(payments);	
				};
			});
		}catch (e){
			console.log(e);
			return reject({message:"Database error getting payments to be invoiced"});
		};
	});	
};

// promise to get exam center info
var P_get_exam_center = async(idExam_center)=>{
	return await new Promise((resolve,reject) => {
		try{
			dbHandlers.Qgen_exam_center.Qget_byIdExam_center(idExam_center,(e,exam_center)=>{
				if (e){
					console.log(e);
					// return res.status(500).json({message:"Database error getting exam center info"});
					reject({message:"Database error getting exam center info"});
				}else{
					// header for main message
					var header = {
						name: exam_center[0].Exam_center_name,
	  					address: exam_center[0].Address,
	  					postalCode:exam_center[0].Zip_code,
	  					city:exam_center[0].Location,
	  					phone:exam_center[0].Telephone1,
	  					email:exam_center[0].Email1,
	  					number:exam_center[0].Exam_center_num
					};
					resolve(header);
				};
			});
		}catch (e){
			console.log(e);
			return reject({message:"Database error getting exam center info"});
		};
	});	
};

// promise to get payment info for invoice by id
var P_get_payment_info = async (idpayment,idExam_center)=>{
	return await new Promise((resolve,reject) => {
		try{
			dbHandlers.Qgen_payment.Qget_PaymentsInvoice(idpayment,idExam_center,(e,invoice_info)=>{
				if (e){
					console.log(e);
					// return res.status(500).json({message:"Database error getting payment info"});
					reject({message:"Database error getting payment info"});
				}else{
					resolve(invoice_info);
				}
			});
		}catch (e){
			console.log(e);
			return reject({message:"Database error getting payment info"});
		};
	});	
};

//promise get student nif through payment
var P_get_nif_student = async (idpayment)=>{
	return await new Promise((resolve,reject) => {
		try{
			dbHandlers.Qgen_student.Qget_byPayment_StudentNif(idpayment,(e,nif)=>{
				if (e){
					console.log(e);	
					reject({message:"Database error getting student nif"});
				}else{
					resolve(nif);
				}
			});
		}catch (e){
			console.log(e);
			return reject({message:"Database error getting student nif"});
		};
	});
};

// get transactions for given payment
var P_get_transactions = async (idPayment,cb)=>{
	return await new Promise((resolve,reject) => {
		try{
			var payments=[];
			dbHandlers.Qgen_transactions.Qget_ByPayment_Transactions(idPayment,(e,transactions)=>{
				console.log("TRANSACTIONS ON "+ idPayment);
				if (e){
					console.log(e);
					reject(null);
				}else if (transactions.length<=0){
					// nothing to do here
					resolve();
				}else{
					for (const iterator of transactions){
						payments.push({method:iterator.Name,
							value:iterator.Transaction_value
						});
					};
					resolve(payments);
				};
			});
		}catch (e){
			console.log(e);
			return reject({message:"Database error getting transactions"});
		};
	});
};

var P_generate_invoices_JSON = async(invoice,payments,idExam_center,cb)=>{
	// console.log(payments);
	for (const element of payments){
		console.log(element);
		var invoice_info = await P_get_payment_info(element.idPayment,idExam_center);
		console.log("Info for invoice "+JSON.stringify(invoice_info));
		// get nif depending if is school or autopropose
		if (invoice_info[0].Permit===999){
			var temp_student = await P_get_nif_student(element.idPayment);
			var msg_invoice = {type: "FR",
					customerName:temp_student[0].Student_name,
					customerNIF:temp_student[0].Tax_num,
					customerPermit:invoice_info[0].Permit
			};	
		}else{
			var msg_invoice = {type: "FR",
					customerNIF: invoice_info[0].nif
			};	
		};
		var products = [];
		invoice_info.forEach((element)=>{
			products.push({code:element.exam_type_code,
				unitPrice:element.base_value,
				quantity:element.Quantity,
				tax:element.Tax
			});
			if (element.exam_tax_price){
					products.push({code:element.exam_tax_code,
					unitPrice:element.exam_tax_price,
					quantity:element.Quantity,
					tax:0
				});
			};
		});
		// concatenate products for invoice
		msg_invoice.products=products;
		var payments = await P_get_transactions(element.idPayment);
		// concatenate transactions for invoice
		msg_invoice.payments=payments;
		invoice.push(msg_invoice);
	};
	cb(invoice);
};

// generate invoice request
async function P_generate_invoice_request (payments,idExam_center){
	return await new Promise((resolve,reject) => {
		try{
			var invoice=[];
			P_generate_invoices_JSON(invoice,payments,idExam_center,(invoice)=>{
				if (invoice.length>0){
					resolve(invoice);	
				}else{
					reject({message:"Database error creating invoice request"});
				};
			});
		}catch (err){
			// console.log(err);
			return reject({message:"Database error creating invoice request"});
		};
	});
};

//update Payment
async function update_Payment (req,res,next){
	try{
		if (parseInt(req.query.idPayment)>0){
			let Params_payment=_.pick(req.body,['Total_value','Invoice_num']);
			if (_.size(Params_payment)>0){
				dbHandlers.Qgen_payment.Qpatch_Payment(Params_payment,req.query.idPayment,(err,results)=>{
					if(err){
						console.log(err);
						return res.status(500).json({message:"Database error updating payment"});
					}else{
						return res.status(200).json({message:"Payment updated"});
					};
				});
			};
		}else if(req.query.invoice){
			// generate invoices for all payments that dont have Invoice_num
			if (req.body.Exam_center_idExam_center && !req.body.idPayment){
				// get pending invoices for given exam center
				var pending_invoices = await P_get_pending_invoice(req.body.Exam_center_idExam_center);
				if (pending_invoices===null){
					return res.status(204).json({message:"No payments to be invoiced"});
				};
				// get info for given exam center
				var header = await P_get_exam_center(req.body.Exam_center_idExam_center);
				// creates the message compiled for all invoices to be processed
				var msg_invoices = await P_generate_invoice_request(pending_invoices,req.body.Exam_center_idExam_center);
				// console.log(msg_invoices);
				// build request msg to api
				var request_msg={};
				request_msg.header=header;
				request_msg.invoice=msg_invoices;
				// send request to API invoices
				console.log("------------Invoice requested-------------");
				console.log(JSON.stringify(request_msg));
				console.log("------------------------------------------");
				request({
					url:config.api_invoice.url,
					method: 'POST',
					json:request_msg
				},(error, response, body)=>{
					console.log("Invoice received");
					if ("references" in body){
						it_idpayment=0;
						for (const key of Object.keys(body.references)) {
							if (body.references[key].startsWith("FR")){
								dbHandlers.Qgen_payment.Qpatch_invoice_Payments(pending_invoices[it_idpayment].idPayment,body.references[key],(e,results)=>{
									if (e){
										console.log(e);
									};
								});
								it_idpayment++;
							}else{
								// got error on this invoice
							};
						};	
					};
					var pdf=_.pick(body,['pdf']);
					return res.status(200).json(pdf);
				});
			}else if (req.body.Exam_center_idExam_center && req.body.idPayment){
				console.log("one shot!!!");
				// get info for given exam center
				var header = await P_get_exam_center(req.body.Exam_center_idExam_center);
				// creates the message compiled for all invoices to be processed
				var temp_test=[]
				temp_test.push(req.body);
				var msg_invoices = await P_generate_invoice_request(temp_test,req.body.Exam_center_idExam_center);
				// build request msg to api
				var request_msg={};
				request_msg.header=header;
				request_msg.invoice=msg_invoices;
				request({
					url:config.api_invoice.url,
					method: 'POST',
					json:request_msg
				},(error, response, body)=>{
					console.log("Invoice received");
					if ("references" in body){
						for (const key of Object.keys(body.references)) {
							if (body.references[key].startsWith("FR")){
								dbHandlers.Qgen_payment.Qpatch_invoice_Payments(req.body.idPayment,body.references[key],(e,results)=>{
									if (e){
										console.log(e);
									};
								});
							}else{
								// got error on this invoice
							};
						};	
					};
					var pdf=_.pick(body,['pdf']);
					return res.status(200).json(pdf);
				});


			}else{
				return res.status(400).json({message:"Bad request"});	
			};
		}else{
			return res.status(400).json({message:"Bad request"});
		};
	}catch (err){
		console.log(err);
		return res.status(500).json({message:"Database error"});
	};
};


module.exports = {
	getList_Payments,
	create_Payment,
	delete_Payment,
	update_Payment
}