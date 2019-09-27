var dbHandlers = require("../db")
var moment = require('moment')
var Timeslot_Schema = require('../db/schemas/schema_timeslot.json')
var validator = require('node-input-validator')
var _ = require('lodash')

var getList_TimeslotByWeek = async (req, res) => {
	console.log("Getting timeslot");
	console.log(req.query)
	if (req.query.week <= 52 && req.query.year) {
		let beginningOfWeek = moment().week(req.query.week).year(req.query.year).startOf('week').local().format('YYYY-MM-DD');
		// console.log("beginningOfWeek " + beginningOfWeek);
		let endOfWeek = moment().week(req.query.week).year(req.query.year).startOf('week').add(6, 'days').local().format('YYYY-MM-DD');
		// Gets Timeslots from a specific exam center on a specific week
		let pTimeslot = new Promise((resolve, reject) => {
			dbHandlers.Qgen_exam_status.Qget_byProcessCancelID(0,(error,idcancel)=>{
				if (error) {
					console.log(error);
					reject(error);
				}else{
					dbHandlers.Qgen_timeslot.Qget_timeslotByWeek(idcancel[0].idexam_status,beginningOfWeek, endOfWeek, req.params.idExam_center,(error, resTimeslots)=>{ 
						if (error) {
							console.log(error);
							reject(error);
						}else{
							resolve(resTimeslots);	
						};
					});
				};	
			});
		}).catch(() => 0)
		// Gets groups from a specific week and a specific exam center
		let pGroups = new Promise((resolve, reject) => {
			dbHandlers.Qgen_groups.Qget_groupsByWeek(beginningOfWeek, endOfWeek,req.params.idExam_center,(error,groups)=>{ 
				if (error) {
					return reject(error);
				}else{
					return resolve(groups);	
				};
			});
		}).catch(() => 0)

		let resTimeslots = await pTimeslot, groups = await pGroups

		if (resTimeslots === 0) {
			return res.status(500).json({message: 'An error occured while trying to fetch timeslots.'})
		};
		if (groups === 0) {
			return res.status(500).json({message: 'An error occured while trying to fetch groups.'})
		};
		// Structures message to appear the information about a day and then all the reservations 
		// for that specific day
		const arr = [];
		groups.forEach(element =>{
			let lastIndex = arr.push([element]) - 1
			resTimeslots.forEach(resTimeslot => {
				if (new Date(resTimeslot.Timeslot_date).setHours(0, 0, 0, 0) === new Date(element.Group_day).getTime()) {
					arr[lastIndex].push(resTimeslot);
				};
			});
		});
		return res.status(200).json(arr);
	}else{
		return res.status(400).json({message:"Bad request"});
	};
};

var postList_Timeslot = async (req, res) => {
	const tVal = new validator(req.body, Timeslot_Schema), matched = await tVal.check()
	if (!matched) {
		console.log(tVal.errors);
		return res.status(400).json({message:"Bad request"});
	}
	// console.log("params "+req.params.idExam_center);
	// Obtains the timeslot in which the client's Exam_date is inserted in
	dbHandlers.Qgen_timeslot.Qget_TimeslotInDateTime(req.body.Timeslot_date, req.params.idExam_center, 
					req.body.Exam_group, (error, dbTimeslot) => {
		if (error) {
			console.log(error);
			return res.status(500).json({message: 'There was an error while trying to validate entry.'});
		};
		if (dbTimeslot.length !== 0) {
			return res.status(400).json({message: 'Can\'t add a timeslot. It already exists.'});
		};
		// Gets Exam type
		// dbHandlers.Qgen_exam_type.Qget_byIdExam_type(req.body.Exam_type_idExam_type,(error, exam_type)=>{
		// 	if (error) {
		// 		console.log(error);
		// 		return res.status(500).json({message: 'There was an error while trying to get the duration of the exam.'});
		// 	};
		// 	if (exam_type.length === 0) {
		// 		return res.status(400).json({message: 'Exam type does not exist.'});
		// 	};

			// Gets groups by day
			dbHandlers.Qgen_groups.Qget_groupsByDay(req.body.Timeslot_date.substring(0, 10),req.params.idExam_center,(error,groups)=>{
				if (error) {
					console.log(error);
					return res.status(500).json({message: 'There was an error while trying to get groups.'});
				};
				if (groups.length === 0) {
					return res.status(400).json({message: 'Groups for chosen day not found.'});
				};
				if (req.body.Exam_group <= 0 || req.body.Exam_group > groups[0].MAX_Group) {
					return res.status(400).json({message: 'Invalid group entry.'})
				};
				// Adds timeslot
				// End_time: moment.unix(moment.utc('1970-01-01 ' + exam_type[0].Duration, "YYYY-MM-DD HH:mm:ss").unix() + moment(req.body.Begin_time).unix()).format("YYYY-MM-DD HH:mm:ss"), 
				dbHandlers.Qgen_timeslot.Qpost_timeslot([req.body.Timeslot_date,req.body.Begin_time,req.body.End_time,req.body.Exam_group,req.body.Exam_type_idExam_type,
					req.params.idExam_center], (error) => {
					if (error) {
						console.log(error);
						return res.status(500).json({message: 'An error has occurred while trying to add a timeslot.'})
					}else{
						return res.status(200).json({message: 'Timeslot added.'});	
					};
				});
			});
		// });
	});
};

var patchList_Timeslot = async (req, res) => {
	if (req.query.idTimeslot) {
		// const timeslotObj = _.pick(req.body,['Exam_endDate','Exam_type_idExam_type']);
		const timeslotObj = req.body
		// If client wants to change when timeslot finishes
		if (timeslotObj.Exam_endDate){ 
			await new Promise((resolve)=>{
				dbHandlers.Qgen_timeslot.Qget_timeslotById(req.query.idTimeslot, req.params.idExam_center, (error, timeslot) => { // Gets timeslot by id
					if (error) {
						return res.status(500).send({message: 'There was an error while trying to fetch the timeslot.'});
					};
					if (timeslot.length === 0) {
						return res.status(400).send({message: 'Timeslot doesn\'t exist.'});
					};
					// Gets the timeslot in which the Exam_endDate is inserted in
					dbHandlers.Qgen_timeslot.Qget_TimeslotInDateTime(timeslotObj.Exam_endDate, 
							req.params.idExam_center, timeslot[0].Timeslot_Group,(error, timeslot)=>{
						if (error) {
							return res.status(500).send({message: 'There was an error while trying to check the new position and size of the timeslot.'});
						};
						// It's possible to change the timeslot's endDate to the value from the client
						if (timeslot.length === 0 || 
								timeslot[0].idTimeslot.toString() === req.query.idTimeslot || 
								timeslot[0].Exam_date === timeslotObj.Exam_endDate) { 
							return resolve();
						} else {
							return res.status(500).send({message: 'It isn\'t possible to update the timeslot date to the desired time.'});
						};
					});
				});
			});
		};
		// Updates the timeslot
		dbHandlers.Qgen_timeslot.Qpatch_timeslot(timeslotObj, req.query.idTimeslot,(error)=>{ 
			if (error) {
				return res.status(500).json({message: 'There was an error while trying to update the timeslot.'});
			}else{
				return res.status(200).json({message: 'Timeslot updated successfully.'});
			};
		});
	} else {
		return res.status(400).json({message:"Bad request"});
	};
};

var deleteList_Timeslot = (req, res) => {
	if (req.query.idTimeslot) {
		dbHandlers.Qgen_timeslot.Qdelete_timeslot(req.query.idTimeslot, (error) => { // Deletes the timeslot and the respective reservations and temp_students
			if (error) {
				return res.status(500).send({message: 'Error trying to delete the timeslot.'});
			}else{
				return res.status(200).json({message: 'Timeslot deleted '});
			};
		});
	} else {
		return res.status(400).json({message:"Bad request"});
	};
};

module.exports = {
    getList_TimeslotByWeek,
    postList_Timeslot,
    patchList_Timeslot,
    deleteList_Timeslot
}