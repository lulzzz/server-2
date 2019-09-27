var dbHandlers = require("../db");

//create a Student Note
var createStudent_note = (req,res,next) =>{
    dbHandlers.Qgen_student_notes.Qcreate_Student_note(req.body.Note,req.body.Student_idStudent,
                    (err,results)=>{
        if(err){
            res.status(500).send({error:"Database error"})
        }else{
            res.status(200).send({message:"Note created."})
        };
    });
};

//delete Student note by ID
var deleteStudent_note = (req,res,next) =>{
    if(req.query.idStudent && req.query.idStudent_note){
        dbHandlers.Qgen_student_notes.Qdelete_Student_note(req.query.idStudent,req.query.idStudent_note,
                    (err,results)=>{
            if(err){
                res.status(500).send({error:"Database error"});
            }else{
                res.status(200).json(results);
            };    
        });
    }else{
        res.status(400).send({error:"Bad parameters."});   
    };
};


//update student note by ID
var updateStudent_note = (req,res,next) => {
    if(req.query.idStudent && req.query.idStudent_note){
        dbHandlers.Qgen_student_notes.Qupdate_Student_note(req.body,req.query.idStudent_note,
                    req.query.idStudent,(err,results) =>{
            if(err){
                res.status(500).send({error:"Database error"})
            }else{
                res.status(200).json(results);
            };
        });
    }else{
        res.status(400).send({error:"Bad parameters."});      
    };
};

module.exports = {
    createStudent_note,
    deleteStudent_note,
    updateStudent_note
}