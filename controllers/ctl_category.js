var dbHandlers = require("../db");

//get all Categories
var getAllCategories = (req,res,next)=>{
    dbHandlers.Qgen_category.Qget_AllCategories((err,results)=>{
        if(err){
            console.log(err);
            res.status(500).json({message:"Error getting categories"});
        }else{
            res.status(200).json(results);
        };
    });
};

//post category by name 
var createCategory = (req,res,next) =>{
    dbHandlers.Qgen_category.Qcreate_Category(req.body.Category, (err,results) =>{
        if(err){
            console.log(err);
            res.status(500).json({message:"Error creating category"});
        }else{
            res.status(200).json({message:"Category created"});
        };
    });
};

//delete category by Id
var deleteCategory = (req,res,next) =>{
    if (parseInt(req.query.idType_category)>0){
        dbHandlers.Qgen_category.Qdelete_Category(req.query.idType_category, (err, results) =>{
            if(err){
                console.log(err);
                res.status(500).json({message:"Error deleting category"});
            }else{ 
                res.status(200).json({message:"Category deleted"})
            };
        });
    }else{
        res.status(400).json({message:"Bad request"});   
    };
};

//Update category by Id
var updateCategory = (req,res,next) =>{
    if (parseInt(req.query.idType_category)>0){
        if (req.body.Category){
            dbHandlers.Qgen_category.Qupdate_Category(req.query.idType_category, req.body.Category, (err, results) =>{
                if(err){
                    console.log(err);
                    res.status(500).json({message:"Error updating category"});
                }else{
                    res.status(200).json({message:"Category updated"});
                };
            });   
        };
    }else{
        res.status(400).json({message:"Bad request"});   
    };
};

module.exports = {
    getAllCategories,
    createCategory,
    deleteCategory,
    updateCategory
}