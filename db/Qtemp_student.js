// creates temp student for reservations
var Qpost_temp_Student = (object, cb) => {
    return myQuery("INSERT INTO Temp_Student (Student_name, Birth_date, " +
        "ID_num, ID_expire_date, tax_num, Drive_license_num, Obs, School_Permit, " +
        "Student_license,Expiration_date, Reservation_idReservation,Type_category_idType_category, "+
        "T_ID_type_idT_ID_type) VALUES (?)", [object], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// patch tem student for reservations
var Qpatch_Temp_Student = (values, id, cb) => {
    return myQuery("UPDATE Temp_Student SET ? WHERE idTemp_Student=?;", [values, id], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

module.exports = () => {
    return {
        Qpost_temp_Student,
        Qpatch_Temp_Student
    }
}