// get all pendent reservations for given date
var Qget_AllPendentReservations=(idExam_center,cb)=>{
    return myQuery('SELECT reservation.*,temp_student.*, School_name,'+
                    'Type_category.idType_category, Type_category.Category, Exam_type.Exam_type_name,'+
                    'timeslot.idTimeslot,timeslot.Timeslot_date,timeslot.Begin_time,timeslot.End_time,timeslot.Exam_group '+
                'FROM reservation ' +
                'LEFT JOIN Exam_type ON reservation.Exam_type_idExam_type=Exam_type.idExam_type ' +
                'LEFT JOIN Type_category ON Exam_type.Type_category_idType_category = Type_category.idType_category ' +
                'INNER JOIN Timeslot ON reservation.Timeslot_idTimeslot = Timeslot.idTimeslot ' +
                'LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation ' +
                'LEFT JOIN T_ID_type ON T_ID_type.idT_ID_type = Temp_Student.T_ID_type_idT_ID_type ' +
                'LEFT JOIN School ON School.Permit = Temp_Student.School_Permit ' + 
                'WHERE reservation.Lock_expiration_date IS NULL ' +  
                'AND Timeslot.Exam_center_idExam_center = ?',
                [idExam_center], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// get all pendent reservations for given date
var Qget_AllReservationsforSchedule=(idExam_center,cb)=>{
    return myQuery('SELECT reservation.*,temp_student.*, School_name,'+
                    'Type_category.idType_category, Type_category.Category, Exam_type.Exam_type_name,'+
                    'timeslot.idTimeslot,timeslot.Timeslot_date,timeslot.Begin_time,timeslot.End_time,timeslot.Exam_group '+
                'FROM reservation ' +
                'LEFT JOIN Exam_type ON reservation.Exam_type_idExam_type=Exam_type.idExam_type ' +
                'LEFT JOIN Type_category ON Exam_type.Type_category_idType_category = Type_category.idType_category ' +
                'INNER JOIN Timeslot ON reservation.Timeslot_idTimeslot = Timeslot.idTimeslot ' +
                'LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation ' +
                'LEFT JOIN T_ID_type ON T_ID_type.idT_ID_type = Temp_Student.T_ID_type_idT_ID_type ' +
                'LEFT JOIN School ON School.Permit = Temp_Student.School_Permit ' + 
                'WHERE AND Timeslot.Exam_center_idExam_center = ?',
                [idExam_center], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};


// get resevation by timeslot
var Qget_byIdReservation = (id, cb) => {
    return myQuery('SELECT reservation.*,temp_student.*, School_name,'+
                    'Type_category.idType_category, Type_category.Category, Exam_type.Exam_type_name,timeslot.* '+
            'FROM reservation ' +
            'LEFT JOIN Exam_type ON reservation.Exam_type_idExam_type=Exam_type.idExam_type ' +
            'LEFT JOIN Type_category ON Exam_type.Type_category_idType_category = Type_category.idType_category ' +
            'INNER JOIN Timeslot ON reservation.Timeslot_idTimeslot = Timeslot.idTimeslot ' +
            'LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation ' +
            'LEFT JOIN T_ID_type ON T_ID_type.idT_ID_type = Temp_Student.T_ID_type_idT_ID_type ' +
            'LEFT JOIN School ON School.Permit = Temp_Student.School_Permit ' + 
            'WHERE reservation.idReservation = ?',[id], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// get resevation by timeslot
var Qget_reservationsDetailedByTimeslot = (idTimeslot, idExam_center, cb) => {
    return myQuery("SELECT reservation.*,temp_student.*, School_name,"+
                    "Type_category.idType_category, Type_category.Category, Exam_type.Exam_type_name,timeslot.* "+
                "FROM reservation " +
                "LEFT JOIN Exam_type ON Exam_type.idExam_type = reservation.Exam_type_idExam_type " +
                "LEFT JOIN Type_category ON Exam_type.Type_category_idType_category = Type_category.idType_category " +
                "INNER JOIN Timeslot ON reservation.Timeslot_idTimeslot = Timeslot.idTimeslot " +
                "LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation " +
                "LEFT JOIN T_ID_type ON T_ID_type.idT_ID_type = Temp_Student.T_ID_type_idT_ID_type " +
                "LEFT JOIN School ON School.Permit = Temp_Student.School_Permit " + 
                "WHERE Timeslot_idTimeslot = ? AND Timeslot.Exam_center_idExam_center = ?",
                [idTimeslot, idExam_center], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

var Qget_lockedReservationsByTimeslotAndUser = (idTimeslot, idExam_center, Account_User, cb) => {
    return myQuery("SELECT reservation.* FROM reservation " +
                "INNER JOIN Timeslot ON Timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
                "WHERE Timeslot.Exam_center_idExam_center=? AND reservation.Lock_expiration_date is NOT NULL " +
                "AND Timeslot.idTimeslot=? AND reservation.Account_User=?",
                [idExam_center, idTimeslot, Account_User], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// Get reservations by status on reservation
var Qget_byStatusReservations = (idstatus,idExam_center,cb)=>{
        return myQuery("SELECT reservation.*,Temp_Student.* FROM reservation " +
                "INNER JOIN Timeslot ON Timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
                "LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation " +
                "WHERE Exam_center_idExam_center=? AND T_exam_status_idexam_status =?",
                [idExam_center, idstatus], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// Get reservations by permit on reservation temp student
var Qget_byPermitReservations = (permit,idExam_center,cb)=>{
        return myQuery("SELECT reservation.*,Temp_Student.* FROM reservation " +
                "INNER JOIN Timeslot ON Timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
                "LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation " +
                "WHERE Exam_center_idExam_center=? AND Temp_Student.School_Permit =?",
                [idExam_center, permit], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// Get reservations by day on reservation
var Qget_byDateReservations = (date,idExam_center,cb)=>{
        return myQuery("SELECT reservation.*,Temp_Student.* FROM reservation " +
                "INNER JOIN Timeslot ON Timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
                "LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation " +
                "WHERE Exam_center_idExam_center=? AND Timeslot.Timeslot_date =?",
                [idExam_center, date], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// get the reservations that are paid and in pending status for given exam center
var Qget_PaidPendingReservations=(idExam_center,cb)=>{
    return myQuery("SELECT reservation.*,Temp_Student.* FROM reservation " +
                "INNER JOIN Timeslot ON Timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
                "LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation " +
                "LEFT JOIN Pendent_payments ON reservation.idReservation = Pendent_payments.Reservation_idReservation " +
                "WHERE Exam_center_idExam_center=? AND reservation.T_exam_status_idexam_status=3 AND Pendent_payments.Payments_idPayments IS NOT NULL",
                [idExam_center], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// get the reservations that are paid and in pending status for given exam center
var Qget_byIdPaidPendingReservations=(idExam_center,idreservation,cb)=>{
    return myQuery("SELECT reservation.*,Temp_Student.* FROM reservation " +
                "INNER JOIN Timeslot ON Timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
                "LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation " +
                "LEFT JOIN Pendent_payments ON reservation.idReservation = Pendent_payments.Reservation_idReservation " +
                "WHERE Exam_center_idExam_center=? AND reservation.idreservation=? AND reservation.T_exam_status_idexam_status=3 AND Pendent_payments.Payments_idPayments IS NOT NULL",
                [idExam_center,idreservation], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// Get reservations by student name on reservation temp student
var Qget_byStudentNameReservations = (name,idExam_center,cb)=>{
        return myQuery("SELECT reservation.*,Temp_Student.* FROM reservation " +
                "INNER JOIN Timeslot ON Timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
                "LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation " +
                "WHERE Exam_center_idExam_center=? AND Temp_Student.Student_name LIKE ?",
                [idExam_center, "%"+name+"%"], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// Get reservations by student name on reservation temp student
var Qget_byIDnumReservations = (id_num,idExam_center,cb)=>{
        return myQuery("SELECT reservation.*,Temp_Student.* FROM reservation " +
                "INNER JOIN Timeslot ON Timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
                "LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation " +
                "WHERE Exam_center_idExam_center=? AND Temp_Student.ID_num =?",
                [idExam_center, id_num], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// Get reservations by student name on reservation temp student
var Qget_byTaxnumReservations = (tax_num,idExam_center,cb)=>{
        return myQuery("SELECT reservation.*,Temp_Student.* FROM reservation " +
                "INNER JOIN Timeslot ON Timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
                "LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = reservation.idReservation " +
                "WHERE Exam_center_idExam_center=? AND Temp_Student.Tax_num =?",
                [idExam_center, tax_num], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

var Qget_byIdEasyPay = (idEasyPay, cb) => {
    return myQuery("SELECT idReservation, idPendent_payments, idEasyPay, Exam_price, Exam_center_idExam_center FROM reservation " +
        "inner join pendent_payments on reservation.idReservation = pendent_payments.Reservation_idReservation " +
        "inner join timeslot on reservation.Timeslot_idTimeslot = timeslot.idTimeslot " +
        "where idEasyPay = ?",
        [idEasyPay], (error, results, fields) => {
            error ? cb(error) : cb(false, results);
        });
};

// get easyPay references that don't have a payment
var Qget_reservationWithouthEasyPayId = (cb) => {
    return myQuery('SELECT reservation.idReservation, pendent_payments.Exam_price, temp_student.School_permit, Timeslot.Exam_center_idExam_center FROM reservation ' + 
        'Inner join pendent_payments on pendent_payments.Reservation_idReservation = reservation.idReservation ' + 
        'inner join temp_student on temp_student.Reservation_idReservation = reservation.idReservation ' +
        'left join timeslot on reservation.Timeslot_idTimeslot = Timeslot.idTimeslot ' +
        'where reservation.idEasypay IS NULL AND reservation.Lock_expiration_date IS NULL', [null],(error, results, fields) => {
            error ? cb(error) : cb(false, results);
    });
};

// get car plate from reservation
var Qget_byIdbooked_car_plate = (idbooking,cb)=>{
    return myQuery('SELECT reservation.car_plate FROM booked,reservation '+
                    'WHERE booked.Reservation_idReservation = Reservation.idReservation '+
                    'AND booked.idBooked = ? LIMIT 1',[idbooking],(error, results, fields) => {
            error ? cb(error) : cb(false, results);
    });       
};

var Qpost_reservations = (object, cb) => {
    return myQuery('INSERT INTO `reservation` (`Timeslot_idTimeslot`,`Account_User`,`Lock_expiration_date`,'+
                'Exam_type_idExam_type,T_exam_status_idexam_status) VALUES (?)', [object], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};
var Qpost_pairReservations = (object, cb) => {
    return myQuery('INSERT INTO `reservation` (`Timeslot_idTimeslot`,`Account_User`,`Lock_expiration_date`,'+
                'Exam_type_idExam_type,T_exam_status_idexam_status) VALUES (?), (?)', [object, object], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

var Qpatch_reservation = (object, id, cb) => {
    console.log(JSON.stringify(object));
    return myQuery("UPDATE reservation SET ? WHERE idReservation=?", [object, id], (error,results,fields) => {
        error ? cb(error) : cb(false,results)
    });
};

var Qpatch_reservationArray = (object, id, cb) => {
    return myQuery("UPDATE reservation SET ? WHERE idReservation IN (?);", [object, id], (error,results,fields) => {
        error ? cb(error) : cb(false,results)
    });
};

var Qpatch_Cancelreservation = (idcancel,id, cb) => {
    return myQuery("UPDATE reservation SET T_exam_status_idexam_status=? WHERE idReservation=?", [idcancel, id], (error,results,fields) => {
        error ? cb(error) : cb(false,results)
    });
};

var Qpatch_Pendentreservation = (idpendent,id, cb) => {
    return myQuery("UPDATE reservation SET T_exam_status_idexam_status=? WHERE idReservation=?", [idpendent, id], (error,results,fields) => {
        error ? cb(error) : cb(false,results)
    });
};

var Qdelete_lockedExpiredReservationsByIdTimeslot = (Timeslot_idTimeslot, now, cb) => {
    return myQuery('DELETE FROM reservation WHERE Timeslot_idTimeslot = ? AND ? >= Lock_expiration_date',[Timeslot_idTimeslot, now],
                (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};
var Qdelete_reservationsById = (id, idExam_center, cb) => {
    return myQuery('DELETE reservation FROM reservation INNER JOIN Timeslot ON Timeslot.idTimeslot=reservation.Timeslot_idTimeslot '+
                'WHERE idReservation=? AND Exam_center_idExam_center=?', [id, idExam_center], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// -----------------------------------ADVANCE SEARCH------------------------------------------
var Qget_search=(query,values,cb)=>{

    let customQuery='SELECT Reservation.*,Temp_Student.* '+
                'FROM Timeslot '+
                'LEFT JOIN Reservation ON Reservation.Timeslot_idTimeslot = Timeslot.idTimeslot '+
                'LEFT JOIN Temp_Student ON Temp_Student.Reservation_idReservation = Reservation.idReservation '+
                'WHERE ' + query;
    console.log(customQuery)
    return myQuery(customQuery,values,(error, results, fields)=>{
        error ? cb(error) : cb(false,results);
    }); 
};

module.exports = (myQuery) => {
    return {
        Qget_AllPendentReservations,
        Qget_byIdReservation,
        Qget_reservationsDetailedByTimeslot,
        Qget_lockedReservationsByTimeslotAndUser,
        Qget_byStatusReservations,
        Qget_byPermitReservations,
        Qget_PaidPendingReservations,
        Qget_byIdPaidPendingReservations,
        Qget_byDateReservations,
        Qget_byStudentNameReservations,
        Qget_byIDnumReservations,
        Qget_byTaxnumReservations,
        Qget_byIdEasyPay,
        Qget_reservationWithouthEasyPayId,
        Qget_byIdbooked_car_plate,
        Qget_AllReservationsforSchedule,
        Qpost_reservations,
        Qpatch_reservation,
        Qpatch_reservationArray,
        Qpatch_Cancelreservation,
        Qpatch_Pendentreservation,
        Qdelete_lockedExpiredReservationsByIdTimeslot,
        Qdelete_reservationsById,
        Qpost_pairReservations,
        Qget_search
    };
};






            // "host"            : "eu-cdbr-west-02.cleardb.net",
            // "user"            : "bd054856aacb55",
            // "password"        : "2e207c21",
            // "database"        : "heroku_25f209348418839"