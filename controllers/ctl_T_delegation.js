var dbHandlers = require("../db");

//get list of delegations
var getListDelegation = (req,res,next) =>{
  if (req.query.idDelegation){
    dbHandlers.Qgen_delegation.Qget_byIdDelegations(req.query.idDelegation,(err,results)=>{
      if (err){
        res.status(500).send({message:"Database error getting delegation by id"});
      }else{
        res.status(200).json(results);
      };
    });
  }else{
    dbHandlers.Qgen_delegation.Qget_AllDelegations((err, results) =>{
      if(err){
        res.status(500).send({message:"Database error getting delegations list"});
      }else{
        res.status(200).json(results);
      };
    }); 
  };
};

//create delegation
var createDelegation = (req,res,next) =>{
  dbHandlers.Qgen_delegation.Qcreate_Delegation([req.body.Delegation_name,req.body.Delegation_num,
            req.body.Delegation_short],(err,results) =>{
    if(err){
      res.status(500).send({message:"Database error creating delegation"});
    }else{
      res.status(200).json({message:"Delegation created"});
    };
  });
};

//delete delegation from list
var deleteDelegation = (req,res,next) =>{
  if (req.query.idDelegation){
    dbHandlers.Qgen_delegation.Qdelete_Delegation(req.query.idDelegation,(err,results)=>{
      if(err){
        console.log(err);
        res.status(500).json({message:"Database error deleting delegation"});
      }else{
        res.status(200).json({message:"Delegation deleted"});
      };  
    });
  }else{
    res.status(400).json({message:"Bad Request"});  
  };
};

//update Exam Results
var updateDelegation = (req,res,next) =>{
  if (req.query.idDelegation){
    dbHandlers.Qgen_delegation.Qupdate_ById_Delegation(req.body,req.query.idDelegation,(err,results)=>{
      if(err){
        console.log(err);
        res.status(500).json({message:"Database error updating delegation"});
      }else{
        res.status(200).json({message:"Delegation updated"});
      };
    });
  }else{
    res.status(400).json({message:"Bad Request"});  
  };
};

module.exports = {
  getListDelegation,
  createDelegation,
  deleteDelegation,
  updateDelegation
}
