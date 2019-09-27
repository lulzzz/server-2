// get payment method
var Qget_AllPaymentMethod = (cb) => {
    return myQuery("SELECT * FROM Payment_method", null,(error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

var Qcreate_PaymentMethod = (values, cb) => {
    return myQuery("INSERT INTO Payment_method (Name) VALUES (?)",[values],(error,results,fields)=>{
        error ? cb(error) : cb(false,results);
    });
};

var Qdelete_PaymentMethod = (id, cb) => {
    return myQuery("DELETE FROM Payment_method WHERE idPayment_method=?",[id],(error,results,fields)=>{
        error ? cb(error) : cb(false,results);
    });
};

var Qpatch_PaymentMethod = (id, values, cb) => {
    return myQuery("UPDATE Payment_method SET Name = ? WHERE idPayment_method=?",[values,id], 
                    (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

module.exports = (myQuery) => {
    return {
        Qget_AllPaymentMethod,
        Qcreate_PaymentMethod,
        Qdelete_PaymentMethod,
        Qpatch_PaymentMethod
    }
}