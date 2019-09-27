//get all Invoice_info
var Qget_All_Invoice_info = (cb) =>{
    return myQuery('SELECT * FROM Invoice_info', (error,results,fields) =>{
        error ? cb(error) : cb(false,results);
    });
};

//get Invoice_info by ID School
var Qget_byIDSchool_Invoice_info = (idSchool,cb) =>{
    return myQuery('SELECT idInvoice_info,Invoice_tax_number FROM Invoice_info WHERE School_idSchool = ?',
                        [idSchool], (error,results,fields) =>{
        error? cb(error) : cb(false,results);
    });
};

//post invoice info
var Qcreate_Invoice_info = (values,idSchool,cb) =>{
    return myQuery('INSERT INTO Invoice_info (Invoice_name,Invoice_address,Invoice_location,'+
                        'Invoice_zip_code,Invoice_tax_number,Invoice_email,Send_invoice_email,'+
                        'School_idSchool) VALUES (?,?)', [values,idSchool], (error,results,fields) =>{
        error ? cb(error) : cb(false,results);
    });
};

//update invoice_info
var Qupdate_Invoice_info = (invoiceFields,School_idSchool,cb) =>{
    return myQuery('UPDATE Invoice_info SET ? WHERE School_idSchool = ?',[invoiceFields,School_idSchool], (error,results,fields) =>{
        error ? cb(error) : cb(false,results);
    });
};

module.exports = function(myQuery){
    return{
        Qget_All_Invoice_info,
        Qget_byIDSchool_Invoice_info,
        Qcreate_Invoice_info,
        Qupdate_Invoice_info
    }
}