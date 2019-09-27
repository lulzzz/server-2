var dbHandlers = require("../db");

//get exam center work hours a week
var getWorkHoursByCenter = (req,res,next) =>{
	console.log("Getting work hours");
	if(req.params.idExam_center>0 && req.query.Week_day){
		dbHandlers.Qgen_work_hours.Qget_ByIdExamCenter_WorkHoursADay(req.params.idExam_center,
						req.query.Week_day,(err,results) =>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Database error getting work hours for given exam center"});
			}
			else{
				res.status(200).json(results);
			}
		})	
	}else if(req.params.idExam_center>0){
		dbHandlers.Qgen_work_hours.Qget_ByIdExamCenter_WorkHours(req.params.idExam_center,(err,results) =>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Database error getting work hours for given exam center"});
			}
			else{
				res.status(200).json(results);
			};
		});
	}else{
		res.status(400).json({message:"Bad request"});	
	};
};

//create exam center work hours by exam center Id
var createWorkHour = (req,res,next) =>{
	if(req.body.Exam_center_idExam_center){
		dbHandlers.Qgen_work_hours.QcreateWorkHours([req.body.Week_day,req.body.Start_hour,
					req.body.End_hour,req.body.Obs,req.body.Exam_center_idExam_center],(err,results)=>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Database error creating work hours for the given exam center"});
			}else{
				res.status(200).json({message:"Work hours created for the given exam center"});
			};
		});	
	}else{
		res.status(400).json({message:"Bad request"});	
	};
};

//delete exam center work hours by Id 
var deleteWorkHour = (req,res,next) =>{
	if(req.query.idWork_hours){
      	dbHandlers.Qgen_work_hours.Qdelete_byIdWorkHours(req.query.idWork_hours,(err,results)=>{
            if(err){
                console.log(err);
				res.status(500).json({message:"Database error deleting work hours"});
            }else{
                res.status(200).json({message:"Work hour deleted"});
            };
        });
    }else{
        res.status(400).json({message:"Bad request"});	
    };
};

//Update exam center work hours by Id
var updateWorkHour = (req,res,next) =>{
	if(req.query.idWork_hours){
		dbHandlers.Qgen_work_hours.Qupdate_byIdWorkHours(req.body,req.query.idWork_hours,(err,results) =>{
			if(err){
				console.log(err);
				res.status(500).json({message:"Database error updating work hours"});
			}else{
				res.status(200).json({message:"Work hour updated"});
			};
		});
 	}else{
		res.status(400).json({message:"Bad request"});	
	};
};

module.exports = {
	getWorkHoursByCenter,
	createWorkHour,
	deleteWorkHour,
	updateWorkHour
}
