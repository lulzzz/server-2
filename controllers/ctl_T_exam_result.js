var dbHandlers = require("../db");

//get pauta available results list
var getListExamResult = (req,res,next) =>{
  dbHandlers.Qgen_exam_results.Qget_AllExamResult((err, results) =>{
    if(err){
      res.status(500).send({message:"Database error getting exam results list"});
    }else{
      res.status(200).json(results);
    };
  });
};

//add result to list
var createExamResult = (req,res,next) =>{
  dbHandlers.Qgen_exam_results.Qcreate_ExamResult(req.body.Result,req.body.Code, (err,results) =>{
    if(err){
      res.status(500).send({message:"Database error creating exam result"});
    }else{
      res.status(200).json({message:"Result created"});
    };
  });
};

//delete result from list
var deleteExamResult = (req,res,next) =>{
  if (parseInt(req.query.idT_exam_results)>0){
    dbHandlers.Qgen_exam_results.Qdelete_ByIdExamResult(req.query.idT_exam_results, (err,results) =>{
      if(err){
        res.status(500).send({message:"Database error deleting exam result"});
      }else{
        res.status(200).json({message:"Result deleted"});
      };  
    });
  }else{
    res.status(400).send({message:"Bad Request"});  
  };
};

//update Exam Results
var updateExamResult = (req,res,next) =>{
  if (parseInt(req.query.idT_exam_results)>0){
    if (req.body.Result || req.body.Code){
       dbHandlers.Qgen_exam_results.Qupdate_ById_ExamResult(req.body,req.query.idT_exam_results, (err,results) =>{
        if(err){
          res.status(500).send({message:"Database error updating exam result"});
        }else{
          res.status(200).json({message:"Result updated"});
        };
      }); 
    };
  }else{
    res.status(400).send({message:"Bad Request"});  
  };
};

module.exports = {
  getListExamResult,
  createExamResult,
  deleteExamResult,
  updateExamResult
}
