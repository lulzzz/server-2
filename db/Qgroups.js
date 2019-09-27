var QMax_IDdailygroups = (cb)=>{
    return myQuery("SELECT MAX(idGroups) FROM daily_groups", null,(error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });        
};

var Qget_groupsByWeek = (iDay, fDay, idExam_center, cb) => {
    return myQuery("SELECT * FROM daily_groups WHERE Group_day BETWEEN ? AND ? "+
                        "AND Exam_center_idExam_center=?", [iDay, fDay, idExam_center],
                        (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

var Qget_groupsByDay = (day, idExam_center, cb) => {
    return myQuery("SELECT * FROM daily_groups WHERE Group_day BETWEEN ? AND ? "+
                        "AND Exam_center_idExam_center=?", 
                        [day + ' 00:00:00', day + ' 23:59:59', idExam_center],(error,results,fields)=>{
        error ? cb(error) : cb(false,results);
    });
};

var Qpost_groups = (idExam_Center, object, cb) => {
    // console.log(object)
    return myQuery("INSERT INTO daily_groups (Group_day,Max,Day_lock,Exam_center_idExam_center) "+
                    "VALUES (?, ?)",[object, idExam_Center],(error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

var Qpatch_groups = (values, id, idExam_Center, cb) => {
    return myQuery("UPDATE daily_groups SET ? WHERE idGroups=? AND Exam_center_idExam_center=?",
                    [values, id, idExam_Center], (error,results,fields) => {
        error ? cb(error) : cb(false,results);
    });
};

module.exports = () => {
    return {
        QMax_IDdailygroups,
        Qget_groupsByWeek,
        Qget_groupsByDay,
        Qpost_groups,
        Qpatch_groups
    }
}