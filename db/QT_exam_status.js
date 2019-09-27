var config=require('../config.json');

//get Exam Status 
var Qget_AllExam_Status = (cb) =>{
  // return myQuery('SELECT idexam_status,Status,Process FROM T_exam_status',null, (error, results, fields) =>{
  return myQuery('SELECT t_exam_status.*,IF(t_exam_status.Process <= 0,"' + 
              config.process_names.Reservations + '", '+
              'IF(t_exam_status.Process = 1,"' + config.process_names.Bookings + '","' + 
              config.process_names.Exams + '")) as Description '+
              'FROM t_exam_status',null, (error, results, fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//get Exam Status 
var Qget_byProcessExam_Status = (Process,cb) =>{
  return myQuery('SELECT idexam_status,Status,Process FROM T_exam_status WHERE Process = ?',[Process],
              (error, results, fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//get Exam Status 
var Qget_byProcessReservationID = (Process,cb) =>{
  return myQuery('SELECT idexam_status FROM T_exam_status WHERE Process = ? AND Status="Reservado"',[Process],
              (error, results, fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//get Exam Status 
var Qget_byProcessPendentID = (Process,cb) =>{
  return myQuery('SELECT idexam_status FROM T_exam_status WHERE Process = ? AND Status="Pendente"',[Process],
              (error, results, fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//get Exam Status 
var Qget_byProcessCancelID = (Process,cb) =>{
  return myQuery('SELECT idexam_status FROM T_exam_status WHERE Process = ? AND Status="Cancelado"',[Process],
              (error, results, fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//get Exam Status 
var Qget_byProcessBookedID = (Process,cb) =>{
  return myQuery('SELECT idexam_status FROM T_exam_status WHERE Process = ? AND Status="Marcado"',[Process],
              (error, results, fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//post Exam Status 
var Qcreate_Exam_Status = (values,cb) =>{
  return myQuery('INSERT INTO T_exam_status (Status,Process) VALUES (?)',[values], (error, results, fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//delete Exam Status
var Qdelete_byIdExam_Status = (id,cb) =>{
  return myQuery('DELETE FROM T_exam_status WHERE idexam_status = ? ',[id],(error,results,fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//update Exam Status
var Qupdate_byIdExam_Status = (values,id,cb) =>{
  return myQuery('UPDATE T_exam_status SET ? WHERE idexam_status = ? ',[values,id],(error,results,fields) =>{
    error ? cb(error): cb(false,results)
  });
};


module.exports = (myQuery) => {
  return {
    Qget_AllExam_Status,
    Qget_byProcessExam_Status,
    Qget_byProcessReservationID,
    Qget_byProcessPendentID,
    Qget_byProcessCancelID,
    Qget_byProcessBookedID,
    Qcreate_Exam_Status,
    Qdelete_byIdExam_Status,
    Qupdate_byIdExam_Status
  }
}