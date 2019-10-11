const request = require('request');
const fs = require('fs');
const multer = require('multer');
const csv = require('fast-csv');
var config=require('../config.json');
var dbHandlers = require("../db");


var getPEP = (req, res)=>{
    try {
        var conditions = ['Booked.Exam_center_idExam_center = ?'];
        var values = [req.params.idExam_center];
        var conditionsStr;
        if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 === 'undefined') {
            conditions.push('timeslot.Timeslot_date = ?');
            values.push(req.body.Timeslot_date1);
        } else if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined') {
            conditions.push('timeslot.Timeslot_date BETWEEN ? AND ?');
            values.push(req.body.Timeslot_date1);
            values.push(req.body.Timeslot_date2);
        };

        // se não for especificado, vai buscar os resultados não enviados ou com erros
        if (typeof req.body.idsicc_status !== 'undefined') {
            conditions.push('booked.sicc_status_idsicc_status = ?');
            values.push(req.body.idsicc_status);
        } else {
            conditions.push('(booked.sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 1 AND operation = 1) OR booked.sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 1 AND operation = 3))');
        }
        if (typeof req.body.Pauta_num !== 'undefined') {
            conditions.push('pauta.Pauta_num = ?');
            values.push(req.body.Pauta_num);
        };
        if (typeof req.body.Student_license !== 'undefined') {
            conditions.push('student_license.Student_license = ?');
            values.push(req.body.Student_license);
        };
        if (typeof req.body.idExam_type !== 'undefined') {
            conditions.push('exam_type.idExam_type = ?');
            values.push(req.body.idExam_type);
        };

        conditionsStr = conditions.length ? conditions.join(' AND ') : '1';

        console.log("TESTE    " + conditionsStr)

        dbHandlers.Qgen_imtt.Qget_search_PEP(conditionsStr, values, (err, PEP) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json({message:"Database error fetching PEP"});
            } else if (PEP.length === 0) {
                return res.status(204).json("No records found");
            }else{
                return res.status(200).json(PEP);    
            }
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message:"Database error creating file"});
    };
};

var getREP = (req, res)=>{
    try {    
        var conditions = ['Booked.Exam_center_idExam_center = ?'];
        var values = [req.params.idExam_center];
        var conditionsStr;
        if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 === 'undefined') {
            conditions.push('timeslot.Timeslot_date = ?');
            values.push(req.body.Timeslot_date1);
        } else if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined') {
            conditions.push('timeslot.Timeslot_date BETWEEN ? AND ?');
            values.push(req.body.Timeslot_date1);
            values.push(req.body.Timeslot_date2);
        };
        if (typeof req.body.Pauta_num !== 'undefined') {
            conditions.push('pauta.Pauta_num = ?');
            values.push(req.body.Pauta_num);
        };
        if (typeof req.body.Student_license !== 'undefined') {
            conditions.push('student_license.Student_license = ?');
            values.push(req.body.Student_license);
        };

        // se não for especificado, vai buscar os resultados não enviados ou com erros
        if (typeof req.body.idsicc_status !== 'undefined') {
            conditions.push('exam.sicc_status_idsicc_status = ?');
            values.push(req.body.idsicc_status);
        } else {
            conditions.push('(exam.sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 3 AND operation = 1) OR exam.sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 3 AND operation = 3))');
        }

        if (typeof req.body.idExam_type !== 'undefined') {
            conditions.push('exam_type.idExam_type = ?');
            values.push(req.body.idExam_type);
        };

        conditionsStr = conditions.length ? conditions.join(' AND ') : '1';

        dbHandlers.Qgen_imtt.Qget_search_REP(conditionsStr, values, (err, REP) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json({message:"Database error fetching REP"});
            } else if (results.length === 0) {
                return res.status(204).send("No records found")
            }else{
                return res.status(200).json(REP);
            };
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message:"Database error creating file"});
    };
};

var getETC = (req, res)=>{
    try {    
        var conditions = ['Booked.Exam_center_idExam_center = ?'];
        var values = [req.params.idExam_center];
        var conditionsStr;
        if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 === 'undefined') {
            conditions.push('timeslot.Timeslot_date = ?');
            values.push(req.body.Timeslot_date1);
        } else if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined') {
            conditions.push('timeslot.Timeslot_date BETWEEN ? AND ?');
            values.push(req.body.Timeslot_date1);
            values.push(req.body.Timeslot_date2);
        };

        // se não for especificado, vai buscar os resultados não enviados ou com erros
        if (typeof req.body.idsicc_status !== 'undefined') {
            conditions.push('student_license.T_sicc_status_idsicc_status = ?');
            values.push(req.body.idsicc_status);
        } else {
            conditions.push('(student_license.T_sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 2 AND operation = 1) OR student_license.T_sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 2 AND operation = 3))');
        }

        conditionsStr = conditions.length ? conditions.join(' AND ') : '1';

        dbHandlers.Qgen_imtt.Qget_search_ETC(conditionsStr, values, (err, ETC) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json({message:"Database error fetching ETC"});
            } else if (results.length === 0) {
                return res.status(204).json({message:"No records found"});
            } else {
                return res.status(200).json(ETC);
            };
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({message:"Database error creating file"});
    };
};


/**
 * Scrape response html for PEP, REP or ETC errors
 * @param {html} body 
 */
function scrapeHTML(body) {
    var tmp = []
    var errors = []
    const cheerio = require('cheerio');
    let $ = cheerio.load(body);
    $('td').each(function () {
        tmp.push($(this).text().trim())
    })
    var t = []
    for (let index = 0; index < tmp.length; index++) {
        if (index % 3 === 2) {
            t.push(tmp[index])
            errors.push(t)
            t = []
        }else {
            t.push(tmp[index])
        };
    };
    console.log(errors);
    return errors
};

function sendFile(idexam_center,fileType, fileName, res) {
    dbHandlers.Qgen_exam_center.Qget_imttCredencials(idexam_center,(e,credentials)=>{
        if(e || credentials.length<=0){
            res.send(e);
        }else{
            const loginOptions = {
                method: "POST",
                url:config.imtt_url.imtt_login,
                qs: {
                    username: credentials[0].Center_num,
                    password: credentials[0].Center_code
                },
                jar: true, // remember cookies
                followAllRedirects: true
            };
            const sendFilePEPOptions = {
                method: "POST",
                url: config.imtt_url.imtt_upload,
                jar: true,
                followAllRedirects: true,
                formData: {
                    "tipoFicheiro": fileType, //PEP - 7; REP - 8; ETC - 10;
                    "ficheiro": fs.createReadStream(__dirname + '/' + fileName),
                    "ficheiros[uploadFile]": "Validar"
                }
            }
            request(loginOptions, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    return console.error('login failed:', err);
                }else {
                    console.log('login successful');
                    request(sendFilePEPOptions, function optionalCallback(err, httpResponse, body) {
                        if (err) {
                            return console.error('upload failed:', err);
                        }
                        console.log(body);
                        // res.send(body);
                        return res.status(200).json({message:"File sent successfully"});
                    });
                };
            });
        }
    });
}

/**
 * Build the previous and the current filename
 * @param {string} fileType type of file being generated (PEP, REP or ETC). must be in caps
 * @param {function} cb callback
 */
const filenames = (fileType, cb) => {

    dbHandlers.Qgen_imtt.Qget_sicc_info(fileType,(error,results)=>{
        if(error){
            cb(error)
        }
        let previousfileNum = results[0].num
        let previousFileYear = results[0].year
        let exam_center = results[0].center

        // build previous file name
        let previousFileName = exam_center + '_' + previousFileYear + ("00000000" + previousfileNum).slice(-8) + '.' + fileType;

        let currentFileYear = new Date().getFullYear()
        let currentFileNum = currentFileYear === previousFileYear ? (previousfileNum + 1) : 0

        // build current file name
        let currentFileName = exam_center + '_' + currentFileYear + ("00000000" + currentFileNum).slice(-8) + '.' + fileType;

        var data={
            [fileType + "_num"]:  currentFileNum,
            [fileType + "_year"]:  currentFileYear,
        }
        dbHandlers.Qgen_imtt.Qupdate_sicc_info(data,(error)=>{
            error ? cb(error) : cb(false, [previousFileName, currentFileName]);
        });
    });
};

/**
 * Enviar pedido de execução de prova
 * 
 * @params
 *      - date: "Timeslot_date1": "2019-08-08"
 *      - date interval: "Timeslot_date1": "2019-08-08",
                         "Timeslot_date1": "2019-08-10"
 *      - sicc status: "idsicc_status": ??? ids da tabela?
 *      - student license number: "Student_license": "345342"
 *      - exam_type: "idExam_type": "6"
 *      - Pauta number: "Pauta_num": 1
 */
function PEP(req, res) {
    try {
        var conditions = ['Booked.Exam_center_idExam_center = ?'];
        var values = [req.params.idExam_center];
        var conditionsStr;
        if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 === 'undefined') {
            conditions.push('timeslot.Timeslot_date = ?');
            values.push(req.body.Timeslot_date1);
        } else if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined') {
            conditions.push('timeslot.Timeslot_date BETWEEN ? AND ?');
            values.push(req.body.Timeslot_date1);
            values.push(req.body.Timeslot_date2);
        };

        // se não for especificado, vai buscar os resultados não enviados ou com erros
        if (typeof req.body.idsicc_status !== 'undefined') {
            conditions.push('booked.sicc_status_idsicc_status = ?');
            values.push(req.body.idsicc_status);
        } else {
            conditions.push('(booked.sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 1 AND operation = 1) OR booked.sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 1 AND operation = 3))');
        }
        if (typeof req.body.Pauta_num !== 'undefined') {
            conditions.push('pauta.Pauta_num = ?');
            values.push(req.body.Pauta_num);
        };
        if (typeof req.body.Student_license !== 'undefined') {
            conditions.push('student_license.Student_license = ?');
            values.push(req.body.Student_license);
        };
        if (typeof req.body.idExam_type !== 'undefined') {
            conditions.push('exam_type.idExam_type = ?');
            values.push(req.body.idExam_type);
        };

        conditionsStr = conditions.length ? conditions.join(' AND ') : '1';

        dbHandlers.Qgen_imtt.Qget_search_PEP(conditionsStr, values, (err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json({message:"Database error fetching PEP"});
            } else {
                if (results.length === 0) {
                    return res.status(204).json("No records found");
                }
                // generate previous and current filenames
                filenames('PEP', (err, filenames) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(400).send({message:"Database error creating PEP"});
                    }

                    var pep = {
                        header: {
                            lineType: "C",
                            version: 2,
                            creationDate: new Date().toISOString().slice(0, 10).replace(/\-/g, ''),
                            previousFileName: filenames[0],
                            currentFileName: filenames[1],
                            examCenterCode: req.params.idExam_center
                        },
                        data: [
                        ],
                        footer: {
                            lineType: "R",
                            recordsNumber: 0
                        }
                    }

                    // fill data field with results from query
                    results.forEach(element => {
                        pep.header.examCenterCode = element.examCenterCode
                        var tmp = {}
                        tmp.lineType = "D"
                        tmp.examCenterCode = element.examCenterCode
                        tmp.schoolLicense = element.schoolLicense
                        tmp.docIdType = element.docIdType
                        tmp.docIdNumber = element.docIdNumber
                        tmp.familyName = element.name.split(" ").pop()

                        var lastIndex = element.name.lastIndexOf(" ");
                        element.name = element.name.substring(0, lastIndex);
                        tmp.name = element.name

                        tmp.learningLicenseNumber = element.learningLicenseNumber

                        tmp.examCode = element.examCode

                        var d = new Date(element.examDate);
                        d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
                        tmp.dateTimeExam = d.toISOString().split('T')[0].replace(/\-/g, '') + element.examTime.replace(/\:/g, '').substring(0, 4)
                        pep.data.push(tmp)
                    });

                    // row recordsNumber wit number of objects in data
                    pep.footer.recordsNumber = pep.data.length

                    // build csv
                    var csvHeader = Object.values(pep.header).join(';').replace('\'', '');

                    var csvData = []
                    for (const element of pep.data) {
                        csvData.push(Object.values(element).join(';').replace('\'', ''))
                    }

                    var csvFooter = Object.values(pep.footer).join(';').replace('\'', '');
                    // write file
                    var logStream = fs.createWriteStream(pep.header.currentFileName);

                    logStream.write(csvHeader);
                    logStream.write('\n')
                    if (csvData.length !== 0) {
                        logStream.write(csvData.join('\n'));
                        logStream.write('\n')
                    }
                    logStream.write(csvFooter);
                    logStream.end('\n')

                    logStream.on('finish', function () {
                        res.contentType('text/csv')
                        res.sendFile(process.cwd() + '/' + pep.header.currentFileName)
                        // sendFile(req.params.idExam_center,7, '119_00000000.pep', res)
                        // TODO delete file? upload file to FTP
                        results.forEach(element => {
                            dbHandlers.Qgen_booked.Qupdate_Booking_SiccStatus(element.idBooked,2,(err, result)=>{
                                if (err) throw err;
                                console.log(result.affectedRows + " record(s) updated");
                            });
                        });
                        return res.status(200).json({message:"File sent successfully"});
                    });
                })
            };
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:"Database error creating file"});
    }
}

/**
 * Enviar resultado de provas
 * 
 * @params
 *      - date: "Timeslot_date1": "2019-08-08"
 *      - date interval: "Timeslot_date1": "2019-08-08",
                         "Timeslot_date1": "2019-08-10"
 *      - sicc status: "idsicc_status": ??? ids da tabela?
 *      - student license number: "Student_license": "345342"
 *      - exam_type: "idExam_type": "6"
 *      - Pauta number: "Pauta_num": 1
 */
function REP(req, res) {
    try {
        var conditions = ['Booked.Exam_center_idExam_center = ?'];
        var values = [req.params.idExam_center];
        var conditionsStr;
        if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 === 'undefined') {
            conditions.push('timeslot.Timeslot_date = ?');
            values.push(req.body.Timeslot_date1);
        } else if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined') {
            conditions.push('timeslot.Timeslot_date BETWEEN ? AND ?');
            values.push(req.body.Timeslot_date1);
            values.push(req.body.Timeslot_date2);
        };
        if (typeof req.body.Pauta_num !== 'undefined') {
            conditions.push('pauta.Pauta_num = ?');
            values.push(req.body.Pauta_num);
        };
        if (typeof req.body.Student_license !== 'undefined') {
            conditions.push('student_license.Student_license = ?');
            values.push(req.body.Student_license);
        };

        // se não for especificado, vai buscar os resultados não enviados ou com erros
        if (typeof req.body.idsicc_status !== 'undefined') {
            conditions.push('exam.sicc_status_idsicc_status = ?');
            values.push(req.body.idsicc_status);
        } else {
            conditions.push('(exam.sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 3 AND operation = 1) OR exam.sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 3 AND operation = 3))');
        }

        if (typeof req.body.idExam_type !== 'undefined') {
            conditions.push('exam_type.idExam_type = ?');
            values.push(req.body.idExam_type);
        };

        conditionsStr = conditions.length ? conditions.join(' AND ') : '1';

        dbHandlers.Qgen_imtt.Qget_search_REP(conditionsStr, values, (err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json({message:"Database error fetching REP"});
            } else {
                if (results.length === 0) {
                    return res.status(204).send("No records found")
                }
                // generate previous and current filenames
                filenames('REP', (err, filenames) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(400).send({message:"Database error creating REP"});
                    }
                    var rep = {
                        header: {
                            lineType: "C",
                            version: 1,
                            creationDate: new Date().toISOString().slice(0, 10).replace(/\-/g, ''),
                            previousFileName: filenames[0],
                            currentFileName: filenames[1],
                            examCenterCode: req.params.idExam_center
                        },
                        data: [
                        ],
                        footer: {
                            lineType: "R",
                            recordsNumber: 0
                        }
                    }

                    // fill data field with results from query
                    results.forEach(element => {
                        rep.header.examCenterCode = element.examCenterCode
                        var tmp = {}
                        tmp.lineType = "D"
                        tmp.examCenterCode = element.examCenterCode
                        tmp.schoolLicense = element.schoolLicense
                        tmp.docIdType = element.docIdType
                        tmp.docIdNumber = element.docIdNumber
                        tmp.familyName = element.name.split(" ").pop()

                        var lastIndex = element.name.lastIndexOf(" ");
                        element.name = element.name.substring(0, lastIndex);
                        tmp.name = element.name

                        tmp.learningLicenseNumber = element.learningLicenseNumber

                        tmp.examinerCode = element.examinerCode

                        tmp.examCode = element.examCode

                        var d = new Date(element.examDate);
                        d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
                        tmp.dateTimeExam = d.toISOString().split('T')[0].replace(/\-/g, '') + element.examTime.replace(/\:/g, '').substring(0, 4)

                        tmp.circuitCode = element.circuitCode
                        tmp.examResultCode = element.examResultCode

                        rep.data.push(tmp)
                    });

                    // row recordsNumber wit number of objects in data
                    rep.footer.recordsNumber = rep.data.length

                    // build csv
                    var csvHeader = Object.values(rep.header).join(';').replace('\'', '');
                    var csvData = []
                    for (const element of rep.data) {
                        csvData.push(Object.values(element).join(';').replace('\'', ''))
                    }
                    var csvFooter = Object.values(rep.footer).join(';').replace('\'', '');
                    // write file
                    var logStream = fs.createWriteStream(rep.header.currentFileName);

                    logStream.write(csvHeader);
                    logStream.write('\n')
                    if (csvData.length !== 0) {
                        logStream.write(csvData.join('\n'));
                        logStream.write('\n')
                    }
                    logStream.write(csvFooter);
                    logStream.end('\n')

                    logStream.on('finish', function () {
                        res.contentType('text/csv')
                        res.sendFile(process.cwd() + '/' + rep.header.currentFileName)
                        // sendFile(req.params.idExam_center,8, 'filename.rep', res)
                        // TODO delete file? upload file to FTP
                        results.forEach(element => {
                            dbHandlers.Qgen_exam.Qupdate_Exam_SiccStatus(element.idExam,2,(err, result)=>{
                                if (err) throw err;
                                console.log(result.affectedRows + " record(s) updated");
                            });
                        });
                        // return res.status(200).json({message:"File sent successfully"});
                    });
                })
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:"Database error creating file"});
    }
}

/**
 * Pedido emissão carta de condução
 * 
 * @params
 *      - date: "Timeslot_date1": "2019-08-08"
 *      - date interval: "Timeslot_date1": "2019-08-08",
                         "Timeslot_date1": "2019-08-10"
 *      - sicc status: "idsicc_status": ??? ids da tabela?
 */
function ETC(req, res) {
    try {
        var conditions = ['Booked.Exam_center_idExam_center = ?'];
        var values = [req.params.idExam_center];
        var conditionsStr;
        if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 === 'undefined') {
            conditions.push('timeslot.Timeslot_date = ?');
            values.push(req.body.Timeslot_date1);
        } else if (typeof req.body.Timeslot_date1 !== 'undefined' && typeof req.body.Timeslot_date2 !== 'undefined') {
            conditions.push('timeslot.Timeslot_date BETWEEN ? AND ?');
            values.push(req.body.Timeslot_date1);
            values.push(req.body.Timeslot_date2);
        };

        // se não for especificado, vai buscar os resultados não enviados ou com erros
        if (typeof req.body.idsicc_status !== 'undefined') {
            conditions.push('student_license.T_sicc_status_idsicc_status = ?');
            values.push(req.body.idsicc_status);
        } else {
            conditions.push('(student_license.T_sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 2 AND operation = 1) OR student_license.T_sicc_status_idsicc_status = (select idsicc_status from t_sicc_status where process = 2 AND operation = 3))');
        }

        conditionsStr = conditions.length ? conditions.join(' AND ') : '1';

        dbHandlers.Qgen_imtt.Qget_search_ETC(conditionsStr, values, (err, results) => {
            if (err) {
                console.log(err.message);
                return res.status(500).json({message:"Database error fetching ETC"});
            } else {
                if (results.length === 0) {
                    return res.status(204).send("No records found")
                }
                // generate previous and current filenames
                filenames('ETC', (err, filenames) => {
                    if (err) {
                        console.log(err.message);
                        return res.status(400).send({message:"Database error creating ETC"});
                    }
                    var etc = {
                        header: {
                            lineType: "C",
                            version: 2,
                            creationDate: new Date().toISOString().slice(0, 10).replace(/\-/g, ''),
                            previousFileName: filenames[0],
                            currentFileName: filenames[1],
                            examCenterCode: req.params.idExam_center
                        },
                        data: [
                        ],
                        footer: {
                            lineType: "R",
                            recordsNumber: 0
                        }
                    }

                    // fill data field with results from query
                    results.forEach(element => {
                        etc.header.examCenterCode = element.examCenterCode
                        var tmp = {}
                        tmp.lineType = "D"
                        tmp.examCenterCode = element.examCenterCode
                        tmp.docIdType = element.docIdType
                        tmp.docIdNumber = element.docIdNumber
                        tmp.learningLicenseNumber = element.learningLicenseNumber

                        tmp.NIF = element.NIF

                        etc.data.push(tmp)
                    });

                    // row recordsNumber wit number of objects in data
                    etc.footer.recordsNumber = etc.data.length

                    // build csv
                    var csvHeader = Object.values(etc.header).join(';').replace('\'', '');
                    var csvData = []
                    for (const element of etc.data) {
                        csvData.push(Object.values(element).join(';').replace('\'', ''))
                    }
                    var csvFooter = Object.values(etc.footer).join(';').replace('\'', '');
                    // write file
                    var logStream = fs.createWriteStream(etc.header.currentFileName);

                    logStream.write(csvHeader);
                    logStream.write('\n')
                    if (csvData.length !== 0) {
                        logStream.write(csvData.join('\n'));
                        logStream.write('\n')
                    }
                    logStream.write(csvFooter);
                    logStream.end('\n')

                    logStream.on('finish', function () {
                        res.contentType('text/csv')
                        res.sendFile(process.cwd() + '/' + etc.header.currentFileName)
                        // sendFile(req.params.idExam_center,10, 'filename.etc', res)
                        // TODO delete file? upload file to FTP
                        results.forEach(element => {
                            dbHandlers.Qgen_student_license.Qupdate_License_SiccStatus(element.idStudent_license,2,(err, result)=>{
                                if (err) throw err;
                                console.log(result.affectedRows + " record(s) updated");
                            });
                        });
                        // return res.status(200).json({message:"File sent successfully"});
                    });
                })
            }
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).send({message:"Database error creating file"});
    }
}

var POST_sicc= async (req,res,next)=>{
    if (req.query.getPEP){
        getPEP(req, res);    
    }else if (req.query.getREP){
        getREP(req, res);
    }else if (req.query.getETC){
        getETC(req, res);
    }else if (req.query.createfile){
        if (typeof req.body.sicc !== 'undefined') {
            switch (req.body.sicc.toUpperCase()) {
                case 'PEP':
                    PEP(req, res);
                    break;
                case 'REP':
                    REP(req, res);
                    break;
                case 'ETC':
                    ETC(req, res);
                    break;
                default:
                    return res.status(400).json({message:'Sicc operation not found'})
            }
        }
        else {
            return res.status(400).json({message:'Must have sicc field'})
        };   
    }else if(req.query.uploadfile){
        var upload = multer({ dest: './' }).single('file');
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log(err.message);
                return res.status(406).json({message:"Bad format file"});
            } else if (err) {
                console.log(err.message);
                return res.status(400).json({message:"Bad request"})
            }

        const fileRows = [];
        csv.parseFile(req.file.path, { encoding: 'binary' })
            .on("data", function (data) {
                fileRows.push(data.toString().split(';')); // push each row
            })
            .on("end", function () {
                fs.unlinkSync(req.file.path);   // remove temp file
                let fileName = req.file.originalname
                if (!(fileName.match(/^(PEP|REP|ETC).*$/i))) { // match beginning of file to know the type
                    return res.status(400).json({message:'Invalid file'});
                }
                else if (fileRows.length === 0) {
                    return res.status(400).send({message:'Empty file'});
                }
                else {
                    if (fileName.match(/^(PEP).*$/i)) {
                        for (const element of fileRows){
                            // PEP
                            // element[0] = examCenterCode ; // element[1] = Student_num ; // element[2] = id type; // element[3] = id_num // element[4] = apelido
                            // element[5] = nome // element[6] = licença // element[7] = tipo de exame // element[8] = data exame // element[9] = ??
                            // element[10] = matricula // element[11] = nome do ficheiro enviado // element[12] = cód erro // element[13] = descrição erro
                            dbHandlers.Qgen_imtt.Qget_byLicenseBooked(element[6],(err,result)=>{                     
                                if (err) throw err;
                                if (result.length !== 0) {
                                    var idBooked = result[0].idBooked
                                    if (element[12] === 'N0') {
                                        dbHandlers.Qgen_booked.Qupdate_Booking_SiccStatus(idBooked,4,(err, result)=>{
                                            if (err) throw err;
                                            console.log(result.affectedRows + " record(s) updated");
                                        });
                                    } else {
                                        dbHandlers.Qgen_booked.Qupdate_Booking_SiccStatus(idBooked,3,(err, result)=>{
                                            if (err) throw err;
                                            else {
                                                dbHandlers.Qgen_imtt.Qpost_SiccErrBooked(element[12], element[13], idBooked,(err, result)=>{
                                                    if (err) throw err;
                                                    console.log(result.affectedRows + " record(s) updated");
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        };
                        res.send(fileRows)
                    }
                    else if (fileName.match(/^(REP).*$/i)) {
                        for (const element of fileRows){
                            // REP
                            // element[0] = examCenterCode // element[1] = Student_num // element[2] = id type // element[3] = id_num
                            // element[4] = apelido // element[5] = nome // element[6] = licença // element[7] = tipo de exame // element[8] = data exame
                            // element[9] = matricula // element[10] = ??? // element[11] = resultado prova // element[12] = ??? // element[13] = Licença instrutor
                            // element[14] = nome ficheiro enviado // element[15] = cod err // element[16] = descrição erro
                            dbHandlers.Qgen_imtt.Qget_byLicenseBooked(element[6],(err,result)=>{
                                if (err) throw err;
                                if (result.length !== 0) {
                                    var idExam = result[0].idExam
                                    if (element[15] === 'N0') {
                                        dbHandlers.Qgen_exam.Qupdate_Exam_SiccStatus(idExam,4,(err, result)=>{
                                            if (err) throw err;
                                            console.log(result.affectedRows + " record(s) updated");
                                        });
                                    } else {
                                        dbHandlers.Qgen_exam.Qupdate_Exam_SiccStatus(idExam,3,(err, result)=>{
                                            if (err) throw err;
                                            else {
                                                dbHandlers.Qgen_imtt.Qpost_SiccErrExam(element[15], element[16], idExam,(err, result)=>{
                                                    if (err) throw err;
                                                    console.log(result.affectedRows + " record(s) updated");
                                                });
                                            };
                                        });
                                    }
                                }
                            });
                        };
                        res.send(fileRows)
                    }
                    else if (fileName.match(/^(ETC).*$/i)) {
                        for (const element of fileRows){
                            // apenas trabalhar com as colunas de dados
                            // ignorar cabeçalho e rodapé
                            if (element[0] === 'D') {
                                // ETC
                                // element[0] = "D" data // element[1] = cód erro // element[2] = descrição erro // element[3] = centro exame
                                // element[4] = tipo id // element[5] = id num // element[6] = licença // element[7] = NIF
                                dbHandlers.Qgen_student_license.Qget_Student_license(element[6],(err, result)=>{
                                    if (err) throw err;
                                    if (result.length !== 0) {
                                        var idStudent_license = result[0].idStudent_license
                                        if (element[1] === 'N0') {
                                            dbHandlers.Qgen_student_license.Qupdate_License_SiccStatus(idStudent_license,4,(err, result)=>{
                                                if (err) throw err;
                                                console.log(result.affectedRows + " record(s) updated");
                                            });
                                        } else {
                                            dbHandlers.Qgen_student_license.Qupdate_License_SiccStatus(idStudent_license,3,(err, result)=>{
                                                if (err) throw err;
                                                else {
                                                    dbHandlers.Qgen_imtt.Qpost_SiccErrLicense(element[1], element[2], idStudent_license,(err, result)=>{
                                                        if (err) throw err;
                                                        console.log(result.affectedRows + " record(s) updated");
                                                    });
                                                };
                                            });
                                        };
                                    };
                                });
                            };
                        };
                        res.send(fileRows);
                    };
                };
            });
        });
    }else{
        res.status(400).json({message:"Bad request"});
    };
};

module.exports = {
    POST_sicc
}