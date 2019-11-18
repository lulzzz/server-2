// get all timeslots without pauta for given date
var Qget_byDateTimeslot = (idexam_center,date,cb)=>{
	return myQuery('SELECT * FROM Timeslot LEFT JOIN Pauta '+
                    'ON Timeslot.idTimeslot = Pauta.Timeslot_idTimeslot '+
                    'LEFT JOIN Booked ON Timeslot.idTimeslot = Booked.Timeslot_idTimeslot '+
                    'WHERE Pauta.Timeslot_idTimeslot IS NULL AND Timeslot.Exam_center_idExam_center = ? '+
                    'AND Timeslot.Timeslot_date = ? AND Timeslot.Exam_type_idExam_type IS NOT NULL '+
                    'AND Booked.Timeslot_idTimeslot IS NOT NULL',
                    [idexam_center,date],(error, results, fields)=> {
		error ? cb(error) : cb(false,results);
	});
};

// get all timeslots inside given date and time without examiner (exams that are about to start)
var Qget_nextTimeslot=(idexam_center,date,time,cb)=>{
	return myQuery('SELECT timeslot.* FROM timeslot LEFT JOIN Pauta '+
					'ON Timeslot.idTimeslot = Pauta.Timeslot_idTimeslot '+
					'WHERE Pauta.Examiner_qualifications_idExaminer_qualifications IS NULL '+
					'AND Timeslot_date=? AND Begin_time<=? AND Exam_center_idExam_center = ? '+
					'GROUP BY idTimeslot',[date,time,idexam_center],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

var Qget_timeslotByWeek = (idcancel,iDay, fDay, idExam_center, cb) => {
    return myQuery("SELECT Timeslot.*, Exam_type.Exam_type_name,Type_category.Category, Num_students as Max_Num_Students, " +
            "count(if(reservation.T_exam_status_idexam_status !=?,1,null)) as number_Reservations " +
            "FROM timeslot " +
            "LEFT JOIN reservation ON timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
            "LEFT JOIN Exam_type ON timeslot.Exam_type_idExam_type=Exam_type.idExam_type " +
            "LEFT JOIN Type_category ON Exam_type.Type_category_idType_category=Type_category.idType_category " + 
            "WHERE Timeslot_date BETWEEN ? AND ? AND Timeslot.Exam_center_idExam_center=? " +
            "GROUP BY timeslot.idTimeslot",
            [idcancel,iDay, fDay, idExam_center], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// var Qget_timeslotByWeek = (idcancel,iDay, fDay, idExam_center, cb) => {
// return myQuery(`SELECT T1.*,T2.occupied_book, (T1.occupied_reser+T2.occupied_book) as number_Reservations from
//                     (SELECT Timeslot.*, Exam_type.Exam_type_name,Type_category.Category, Num_students as Max_Num_Students, 
//                         count(if(reservation.T_exam_status_idexam_status = 3 OR reservation.T_exam_status_idexam_status = 9,1,null)) as occupied_reser
//                         FROM timeslot 
//                         LEFT JOIN reservation ON timeslot.idTimeslot=reservation.Timeslot_idTimeslot 
//                         LEFT JOIN Exam_type ON timeslot.Exam_type_idExam_type=Exam_type.idExam_type 
//                         LEFT JOIN Type_category ON Exam_type.Type_category_idType_category=Type_category.idType_category 
//                         WHERE Timeslot_date BETWEEN ? AND ? AND Timeslot.Exam_center_idExam_center=?
//                         GROUP BY timeslot.idTimeslot) AS T1
//                 LEFT JOIN (
//                     SELECT Timeslot.*, Exam_type.Exam_type_name,Type_category.Category, Num_students as Max_Num_Students, 
//                     count(if(booked.T_exam_status_idexam_status !=8,1,null)) as occupied_book
//                     FROM timeslot 
//                     LEFT JOIN booked ON timeslot.idTimeslot=booked.Timeslot_idTimeslot 
//                     LEFT JOIN Exam_type ON timeslot.Exam_type_idExam_type=Exam_type.idExam_type 
//                     LEFT JOIN Type_category ON Exam_type.Type_category_idType_category=Type_category.idType_category 
//                     WHERE Timeslot_date BETWEEN ? AND ? AND Timeslot.Exam_center_idExam_center=?
//                     GROUP BY timeslot.idTimeslot) 
//                 AS T2 ON T1.idTimeslot=T2.idTimeslot`,
//             [idcancel,iDay, fDay, idExam_center], (error,results,fields) => {
//         error ? cb(error) : cb(false,results);
//     });
// };

var Qget_TimeslotInDateTime = (Exam_date,Begin_time,End_time, idExam_center, Exam_group, cb) => {
    return myQuery("SELECT Timeslot.*,Exam_type.Exam_type_name,Type_category.Category, Exam_type.Duration, Exam_type.Num_students " + 
            "FROM Timeslot LEFT JOIN Exam_type ON Timeslot.Exam_type_idExam_type=Exam_type.idExam_type " +
            "LEFT JOIN Type_category ON Exam_type.Type_category_idType_category=Type_category.idType_category " + 
            "WHERE Timeslot.Timeslot_date = ? AND ? >= Timeslot.Begin_time AND ? <= Timeslot.End_time AND Exam_center_idExam_center=? " +
            "AND Exam_group=? AND Timeslot.Exam_type_idExam_type IS NOT NULL",
            [Exam_date, Begin_time,End_time, idExam_center, Exam_group],(error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

var Qget_byIdTimeslot = (idtimeslot,cb)=>{
    return myQuery('SELECT * FROM Timeslot WHERE idTimeslot=? LIMIT 1',[idtimeslot],(error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};


var Qget_timeslotById = (idcancel,id, idExam_center, cb) => {
    return myQuery("SELECT Timeslot.*,Exam_type.Exam_type_name,Type_category.Category, Num_Students as Max_Num_Students, " +
                "count(if(reservation.T_exam_status_idexam_status !=?,1,null)) as number_Reservations " +
                "FROM Timeslot LEFT JOIN reservation ON timeslot.idTimeslot=reservation.Timeslot_idTimeslot " +
                "LEFT JOIN Exam_type ON Timeslot.Exam_type_idExam_type=idExam_type " +
                "LEFT JOIN Type_category ON Exam_type.Type_category_idType_category=Type_category.idType_category " +
                "WHERE Timeslot.idTimeslot = ? AND Timeslot.Exam_center_idExam_center = ? " +
                "GROUP BY Timeslot.idTimeslot",[idcancel,id, idExam_center], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

var Qget_countTimeslot = (idexam_center, date, time, cb) => {
  return myQuery(
    "SELECT examiner_qualifications.*,timeslot.idtimeslot," +
      " count(idtimeslot) as numero FROM examiner_qualifications, Examiner,exam_type,timeslot,pauta" +
      " WHERE examiner_qualifications.Examiner_idExaminer = Examiner.idExaminer" +
      " AND examiner_qualifications.Exam_type_idExam_type=Exam_type.idExam_type" +
      " AND Exam_type.idExam_type=timeslot.Exam_type_idExam_type" +
      " AND Pauta.Timeslot_idTimeslot = Timeslot.idTimeslot" +
      " AND Pauta.Examiner_qualifications_idExaminer_qualifications IS NULL" +
      " AND Examiner.Exam_center_idExam_center = ? AND Examiner.active=1" +
      " AND timeslot.Timeslot_date=? AND timeslot.Begin_time<=?" +
      " group by idtimeslot" +
      " ORDER BY numero ASC",
    [idexam_center, date, time],
    (error, results, fields) => {
      error ? cb(error) : cb(false, results);
    }
  );
};

// creates timeslot
var Qpost_timeslot = (object, cb) => {
    return myQuery('INSERT INTO `timeslot` (`Timeslot_date`,`Begin_time`, `End_time`, `Exam_group`, `Exam_type_idExam_type`, `Exam_center_idExam_center`) ' +
        "VALUES (?)", [object], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// delete timeslot by id
var Qdelete_timeslot = (id, cb) => {
    return myQuery("DELETE FROM Timeslot WHERE idTimeslot=?;", [id], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

// patch timeslot by id
var Qpatch_timeslot = (object, id, cb) => {
    return myQuery("UPDATE Timeslot SET ? WHERE idTimeslot=?;", [object, id], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

module.exports = function(myQuery){
	return {
		Qget_byDateTimeslot,
		Qget_nextTimeslot,
    Qget_byIdTimeslot,
		Qget_timeslotByWeek,
		Qget_TimeslotInDateTime,
		Qget_timeslotById,
    Qget_countTimeslot,
		Qpost_timeslot,
		Qdelete_timeslot,
		Qpatch_timeslot
	}
}

