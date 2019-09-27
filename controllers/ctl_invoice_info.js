const validator = require('node-input-validator');
let Invoice_schema = require('../db/schemas/schema_Invoice_info.json');
var dbHandlers = require("../db");
const _ = require('lodash');
var config=require('../config.json');
var request= require('request');

//get Invoice_info by ID school
var getInvoice_info = (idSchool,cb) =>{
    dbHandlers.Qgen_invoice_info.Qget_byIDSchool_Invoice_info(idSchool,(err,results)=>{
        if(err){
            cb(err);
        }else{
            cb(false,results);
        };
    });
};

//get All Invoice_info
var getAllInvoice_info = (cb)=>{
    dbHandlers.Qgen_invoice_info.Qget_All_Invoice_info((err,results)=>{
        if(err){
            cb(err);
        }else{
            cb(false,results);
        };
    });
};
   
//Create invoice_info
var createInvoice_info = (values,idSchool,cb)=>{
    let val = new validator(values,Invoice_schema);
    val.check().then((matched)=>{
        if(!matched){
           cb('Fail Invoice Schema');
        }else{
            dbHandlers.Qgen_invoice_info.Qcreate_Invoice_info([values.Invoice_name,values.Invoice_address,
                            values.Invoice_location,values.Invoice_zip_code,values.Invoice_tax_number,
                            values.Invoice_email,values.Send_invoice_email],idSchool,
                            (err,results)=>{
                if(err){
                    cb(err);
                }else{
                    cb(false, results);
                };          
            });        
        };
    }); 
};

//update Invoice_info
var updateInvoice_info = (invoiceFields,idSchool,tax_number,cb)=>{
    // create invoice info external api since exists invoice info
    let customer_json={};
    if (invoiceFields.Invoice_name){
        _.merge(customer_json,{name:invoiceFields.Invoice_name});  
    };
    if (invoiceFields.Invoice_address){
        _.merge(customer_json,{address:invoiceFields.Invoice_address});  
    };
    if (invoiceFields.Invoice_location){
        _.merge(customer_json,{city:invoiceFields.Invoice_location});  
    };
    if (invoiceFields.Invoice_zip_code){
        _.merge(customer_json,{postalCode:invoiceFields.Invoice_zip_code});
    };
    if (invoiceFields.Invoice_tax_number){
        _.merge(customer_json,{nif:invoiceFields.Invoice_tax_number});  
    };

    request({
        url:config.api_invoice.url_customer + "/" + tax_number,
        method: 'PATCH',
        json:customer_json
    },(error, response, body)=>{
        if (error){
            // log api error received
            console.log(error);
        }else{
            // sucess
            console.log("Customer updated");
        }
    });

    dbHandlers.Qgen_invoice_info.Qupdate_Invoice_info(invoiceFields,idSchool,(err,results)=>{
        if(err){
            cb(err);
        }else{
            cb(false,results);
        };
    });
};

module.exports = {
    getInvoice_info,
    getAllInvoice_info,
    createInvoice_info,
    updateInvoice_info
}