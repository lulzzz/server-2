var dbHandlers = require("../db");

//get Exam status
var getExamStatus = (req,res,next) =>{
  if(req.query.Process){
    dbHandlers.Qgen_exam_status.Qget_byProcessExam_Status(req.query.Process,(err, results) =>{
      if(err){
        console.log(err);
        res.status(500).send({message:"Database error getting exam status list by process"});
      }else{
        res.status(200).json(results);
      };
    });
  }else{
    dbHandlers.Qgen_exam_status.Qget_AllExam_Status((err, results) =>{
      if(err){
        console.log(err);
        res.status(500).send({message:"Database error getting exam status list"});
      }else{
        res.status(200).json(results);
      };
    });
  };
};

//post Exam status
var createExamStatus = (req,res,next) =>{
  if(req.body.Status && req.body.Process){
    dbHandlers.Qgen_exam_status.Qcreate_Exam_Status([req.body.Status,req.body.Process],(err,results) =>{
      if(err){
        console.log(err);
        res.status(500).send({message:"Database error creating exam status"});
      }else{
        res.status(200).json({message:"Exam status created"});
      };
    });
  }else{
    res.status(400).send({message:"Bad Request"});
  };
};

//delete Exam Status
var deleteExamStatus = (req,res,next) =>{
  if(parseInt(req.query.idexam_status)>0){
    dbHandlers.Qgen_exam_status.Qdelete_byIdExam_Status(req.query.idexam_status,(err,results) =>{
      if(err){
        console.log(err);
        res.status(500).send({message:"Database error deleting exam status"});
      }else{
        res.status(200).json({message:"Exam status deleted"})
      };
    });
  }else{
    res.status(400).send({message:"Bad Request"});
  };
};

//update Exam Status
var updateExamStatus = (req,res,next) =>{
  if(parseInt(req.query.idexam_status)>0){
    if (req.body.Status || req.body.Process){
      dbHandlers.Qgen_exam_status.Qupdate_byIdExam_Status(req.body,req.query.idexam_status,(err,results)=>{
      if(err){
          console.log(err);
          res.status(500).send({message:"Database error updating exam status"});
        }else{
          res.status(200).json({message:"Exam status updated"});
        };
      });
    };
  }else{
    res.status(400).send({message:"Bad Request"});
  };
};

module.exports = {
  getExamStatus,
  createExamStatus,
  deleteExamStatus,
  updateExamStatus
}
