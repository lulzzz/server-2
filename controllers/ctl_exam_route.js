var dbHandlers = require("../db");

//get all Categories
var getAllExam_routes = (req,res,next)=>{
    if (parseInt(req.query.idExam_route)>0){
        dbHandlers.Qgen_exam_routes.Qget_byIdExam_Route(req.query.idExam_route,(err,results)=>{
            if(err){
                console.log(err);
                res.status(500).json({message:"Error getting Exam route"});
            }else{
                res.status(200).json(results);
            };
        });
    }else{
        dbHandlers.Qgen_exam_routes.Qget_AllExam_Routes((err,results)=>{
            if(err){
                console.log(err);
                res.status(500).json({message:"Error getting Exam routes"});
            }else{
                res.status(200).json(results);
            };
        });
    };
};

//post category by name 
var createExam_route = (req,res,next) =>{
    // the 1 if for activate the route
    if(parseInt(req.body.Exam_center_idExam_center)>0){
         dbHandlers.Qgen_exam_routes.Qcreate_Exam_Route([req.body.Route,1,req.body.Code,
                    req.body.High_way,req.body.Conditioned_route,req.body.Exam_center_idExam_center],
                    (err,results) =>{
            if(err){
                console.log(err);
                res.status(500).json({message:"Error creating Exam route"});
            }else{
                res.status(200).json({message:"Exam route created"});
            };
        });   
    }else{
        res.status(400).json({message:"Bad request"});   
    };
};

//delete category by Id
var deleteExam_route = (req,res,next) =>{
    if (parseInt(req.query.idExam_route)>0){
        dbHandlers.Qgen_exam_routes.Qdelete_Exam_Route(req.query.idExam_route, (err, results) =>{
            if(err){
                console.log(err);
                res.status(500).json({message:"Error deleting Exam route"});
            }else{ 
                res.status(200).json({message:"Exam route deleted"})
            };
        });
    }else{
        res.status(400).json({message:"Bad request"});   
    };
};

//Update category by Id
var updateExam_route = (req,res,next) =>{
    if (parseInt(req.query.idExam_route)>0){
        dbHandlers.Qgen_exam_routes.Qupdate_Exam_Route(req.query.idExam_route,req.body, (err, results) =>{
            if(err){
                console.log(err);
                res.status(500).json({message:"Error updating Exam route"});
            }else{
                res.status(200).json({message:"Exam route updated"});
            };
        });  
    }else{
        res.status(400).json({message:"Bad request"});   
    };
};

module.exports = {
    getAllExam_routes,
    createExam_route,
    deleteExam_route,
    updateExam_route
}