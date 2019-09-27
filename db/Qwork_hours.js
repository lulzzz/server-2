//get exam center work hours
var Qget_ByIdExamCenter_WorkHours = (idexam_center, cb) =>{
    return myQuery('SELECT * FROM work_hours WHERE Exam_center_idExam_center = ?',[idexam_center],
    						(error,results,fields)=>{
        error ? cb(error): cb(false,results);
   });
};

//get exam center work hours for a specific day
var Qget_ByIdExamCenter_WorkHoursADay = (idexam_center,day, cb)=>{
    return myQuery('SELECT idWork_hours,Week_day,Start_hour,End_hour FROM work_hours '+
    				'WHERE Exam_center_idExam_center = ? AND Week_day = ?', 
    				[idexam_center,day],(error, results, fields)=>{
        error ? cb(error): cb(false,results);
   });
};

//post exam center work hours a week
var QcreateWorkHours = (values,cb) =>{
	return myQuery('INSERT INTO work_hours (Week_day,Start_hour,End_hour,Obs,Exam_center_idExam_center) '+
					'VALUES (?)',[values], (error,results,fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

//delete exam center work hours by exam center Id
var Qdelete_byIdWorkHours = (id,cb) =>{
	return myQuery('DELETE FROM work_hours WHERE idWork_hours = ?',[id],(error,results,fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

//Update exam center Work hours by exam center Id
var Qupdate_byIdWorkHours = (values,id,cb) =>{
	return myQuery('UPDATE work_hours SET ? WHERE idWork_hours = ?',[values,id],(error,results,fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

module.exports = function(myQuery){
    return{
    	Qget_ByIdExamCenter_WorkHours,
    	Qget_ByIdExamCenter_WorkHoursADay,
    	QcreateWorkHours,
    	Qdelete_byIdWorkHours,
    	Qupdate_byIdWorkHours
    }
}