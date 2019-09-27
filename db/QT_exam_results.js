//get Exam results
var Qget_AllExamResult=(cb)=>{
  return myQuery('SELECT * FROM T_exam_results', null,(error, results,fields)=>{
      error ? cb(error) : cb(false,results);
  });
};

//post exam result by result and code
var Qcreate_ExamResult=(result,code,cb)=>{
  return myQuery('INSERT INTO T_exam_results (Result,Code) VALUES (?,?)',[result,code],(error,results,fields)=>{
    error ? cb(error) : cb(false,results);
  });
};

//delete exam result by id
var Qdelete_ByIdExamResult=(id,cb) =>{
  return myQuery('DELETE FROM T_exam_results WHERE idT_exam_results = ?',[id],(error,results,fields)=>{
    error ? cb(error) : cb(false,results);
  });
};

//update exam result
var Qupdate_ById_ExamResult = (values,id,cb) =>{
  return myQuery('UPDATE T_exam_results SET ? WHERE idT_exam_results = ?',[values,id],(error,results,fields)=>{
    error ? cb(error) : cb(false,results);
  });
};

module.exports = (myQuery) => {
  return {
    Qget_AllExamResult,
    Qcreate_ExamResult,
    Qdelete_ByIdExamResult,
    Qupdate_ById_ExamResult
  }
}