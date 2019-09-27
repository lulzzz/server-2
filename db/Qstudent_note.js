//get all student notes
var Qget_All_student_Notes = (cb) =>{
    return myQuery('SELECT idStudent_note,Note,Student_idStudent FROM Student_note ' +
    					'ORDER BY Student_idStudent ASC ', null, (error,results,fields)=>{
        error ? cb(error) : cb(false,results)
    });
};

//get student notes by ID
var Qget_byIDStudent_Student_note = (id,cb) => {
    return myQuery('SELECT idStudent_note,Note FROM Student_note WHERE Student_idStudent = ?',
    					[id],(error,results,fields) =>{
        error ? cb(error) : cb(false,results)
    });
};

//create a Student Note for given id student
var Qcreate_Student_note = (note,idStudent,cb) => {
    return myQuery('INSERT INTO Student_note (Note,Student_idStudent) VALUES (?,?)',
    					[note,idStudent], (error,results,fields) =>{
        error ? cb(error) : cb(false,results) 
    });
};

//delete student notes for given id student
var Qdelete_Student_note = (idStudent,id,cb) =>{
    return myQuery('DELETE FROM Student_note WHERE Student_idStudent = ? AND idStudent_note = ? ',
    					[idStudent,id],(error,results,fields) =>{
        error ? cb(error) : cb(false,results)
    });
};

//update student notes for given id student
var Qupdate_Student_note = (values,id,idStudent,cb) =>{
    return myQuery('UPDATE Student_note SET ? WHERE idStudent_note = ? AND Student_idStudent = ? ',
    					[values,id,idStudent],(error,results,fields) =>{
        error ? cb(error) : cb(false,results)
    });
};

module.exports = function(myQuery){
    return {
    	Qget_All_student_Notes,
    	Qget_byIDStudent_Student_note,
        Qcreate_Student_note,
        Qdelete_Student_note,
        Qupdate_Student_note
    }
}