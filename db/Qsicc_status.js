var config=require('../config.json');

// //get Exam Status 
// var Qget_AllExam_Status = (cb) =>{
//   // return myQuery('SELECT idexam_status,Status,Process FROM T_exam_status',null, (error, results, fields) =>{
//   return myQuery('SELECT T_sicc_status.*,IF(T_sicc_status.Process <= 0,"' + 
//               config.process_names.Reservations + '", '+
//               'IF(T_sicc_status.Process = 1,"' + config.process_names.Bookings + '","' + 
//               config.process_names.Exams + '")) as Description '+
//               'FROM T_sicc_status',null, (error, results, fields) =>{
//     error ? cb(error): cb(false,results)
//   });
// };

//get sicc Status by process
var Qget_byProcessSicc_status = (Process,cb) =>{
  return myQuery('SELECT * FROM T_sicc_status WHERE process = ?',[Process],
              (error, results, fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//get sicc Status by process and operation
var Qget_byProcess_Operation_Sicc_status = (Process,op,cb) =>{
  return myQuery('SELECT * FROM T_sicc_status WHERE process = ? AND operation=?',[Process,op],
              (error, results, fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//post sicc Status 
var Qcreate_Sicc_status = (values,cb) =>{
  return myQuery('INSERT INTO T_sicc_status (state,process,operation) VALUES (?)',[values], (error, results, fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//delete sicc Status
var Qdelete_byIdSicc_status = (id,cb) =>{
  return myQuery('DELETE FROM T_sicc_status WHERE idsicc_status = ? ',[id],(error,results,fields) =>{
    error ? cb(error): cb(false,results)
  });
};

//update sicc Status
var Qupdate_byIdSicc_status = (values,id,cb) =>{
  return myQuery('UPDATE T_sicc_status SET ? WHERE idsicc_status = ? ',[values,id],(error,results,fields) =>{
    error ? cb(error): cb(false,results)
  });
};


module.exports = (myQuery) => {
  return {
    Qget_byProcessSicc_status,
    Qget_byProcess_Operation_Sicc_status,
    Qcreate_Sicc_status,
    Qdelete_byIdSicc_status,
    Qupdate_byIdSicc_status
  }
}