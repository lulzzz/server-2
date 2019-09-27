var dbHandlers = require("../db");

//get Exam status
var getSiccStatus = (req,res,next) =>{
  if(req.query.Process){
    dbHandlers.Qgen_sicc_status.Qget_byProcessSicc_status(req.query.Process,(err, results) =>{
      if(err){
        console.log(err);
        res.status(500).send({message:"Database error getting exam status list by process"});
      }else{
        res.status(200).json(results);
      };
    });
  }else{
    // dbHandlers.Qgen_exam_status.Qget_AllExam_Status((err, results) =>{
    //   if(err){
    //     console.log(err);
    //     res.status(500).send({message:"Database error getting exam status list"});
    //   }else{
    //     res.status(200).json(results);
    //   };
    // });
  };
};

//post Exam status
var createSiccStatus = (req,res,next) =>{
  if(req.body.Status && req.body.Process){
    dbHandlers.Qgen_sicc_status.Qcreate_Sicc_status([req.body.Status,req.body.Process],(err,results) =>{
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
var deleteSiccStatus = (req,res,next) =>{
  if(parseInt(req.query.idsicc_status)>0){
    dbHandlers.Qgen_sicc_status.Qdelete_byIdSicc_status(req.query.idsicc_status,(err,results) =>{
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
var updateSiccStatus = (req,res,next) =>{
  if(parseInt(req.query.idsicc_status)>0){
    if (req.body.Status || req.body.Process){
      dbHandlers.Qgen_sicc_status.Qupdate_byIdSicc_status(req.body,req.query.idsicc_status,(err,results)=>{
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
  getSiccStatus,
  createSiccStatus,
  deleteSiccStatus,
  updateSiccStatus
}
