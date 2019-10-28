var dbHandlers = require("../db");
var _ = require('lodash');

// get max daily groups id
var get_dailyGroups = (req, res) => {
    if (req.query.maxid){
        dbHandlers.Qgen_groups.QMax_IDdailygroups((error,maxid) => {
            if (error) {
                return res.status(500).json({message: 'Database error fetching id group.'});
            }else{
                return res.status(200).json(maxid);
            };
        });
    }else {
        return res.status(400).json({message: 'Bad request'});
    };
};

// create daily groups
var postList_Groups = (req, res) => {
    if (req.params.idExam_center>0){
        dbHandlers.Qgen_groups.Qpost_groups(req.params.idExam_center, [req.body.Group_day,req.body.Max,req.body.Day_lock], (error) => {
            if (error) {
                return res.status(500).json({message: 'There was an error while adding groups.'});
            }else{
                return res.status(200).json({message: 'Groups added successfully.'});
            };
        });
    }else{
        return res.status(400).json({message: 'Bad request'});
    };
};

// PATCH for max groups for given day
var patchList_Groups = (req, res) => {
    if (req.params.idExam_center>0){
        if (parseInt(req.query.idGroup)>0){
            let Params_daily_groups=_.pick(req.body,['Max','Day_lock']);
            dbHandlers.Qgen_groups.Qpatch_groups(Params_daily_groups,req.query.idGroup, 
                        req.params.idExam_center, (error) => {
                if (error) {
                    return res.status(500).json({message: 'There was an error while updating groups.'});
                }else{
                    return res.status(200).json({message: 'Groups edited successfully.'});   
                };
            });
        };
    }else{
        return res.status(400).json({message: 'Bad request'});
    };
};

// PATCH for max groups for given day
var delete_Groups = (req, res) => {
    if (req.params.idExam_center>0){
        if (req.query.idGroup){
            dbHandlers.Qgen_groups.Qdelete_groups(req.query.idGroup, (error) => {
                if (error) {
                    return res.status(500).json({message: 'There was an error while deleting given group.'});
                }else{
                    return res.status(200).json({message: 'Group deleted.'});   
                };
            });
        };
    }else{
        return res.status(400).json({message: 'Bad request'});
    };
};

module.exports = {
    get_dailyGroups,
    postList_Groups,
    patchList_Groups,
    delete_Groups
}