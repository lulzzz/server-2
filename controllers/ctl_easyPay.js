var dbHandlers = require("../db");
var config = require('../config.json');
var request = require('request');
var _ = require('lodash');
var nodemailer = require('nodemailer');
var moment=require('moment');
var htmlFiles = require('../html');

var bulk = async (id_exam_center) => {
    // console.log('here');
    dbHandlers.Qgen_reservations.Qget_reservationWithouthEasyPayId(id_exam_center,(error, result) => {
        console.log("--------------------------------------------------------------------------------");
        console.log("---------------------------------PROCESSO EASY PAY "+ id_exam_center);
        console.log(" -----------------------NUMERO DE VOLTAS "+ result.length);
        console.log("--------------------------------------------------------------------------------");
        // console.log(JSON.stringify(result));
        if (error) {
            console.log(error);
            // return res.status(500).json({ message: "Error getting EasyPay ids." });
        } else if (result.length > 0) {
            var withouthids = JSON.parse(JSON.stringify(result));
            // map results from bd to grou by school and put idReservation in array
            // TODO verificar que user criou e se pagou em dinheiro
            var mapped = _(withouthids)
                .groupBy('School_permit')
                .map((items, id) => ({
                    School_permit: id,
                    value: _.sumBy(items, 'Exam_price'),
                    idReservation: _.map(items, 'idReservation'),
                    Exam_center_idExam_center:id_exam_center
                    // Exam_center_idExam_center:_.map(items,'Exam_center_idExam_center')
                }))
                .value()
            // To give different expiration depending on day of week
            var today= moment().format("YYYY-MM-DD");
            if (moment().weekday()===5){
                var nextclock=moment().add(3,'day').format("YYYY-MM-DD HH:mm"); 
            }else if (moment().weekday()===6){
                var nextclock=moment().add(2,'day').format("YYYY-MM-DD HH:mm");
            }else {
                var nextclock=moment().add(1,'day').format("YYYY-MM-DD HH:mm");
            };
            mapped.forEach(element => {
                var options = {
                    url: config.easy_pay.easy_pay_url,
                    method: 'POST',
                    headers: {
                        'AccountId': config.easy_pay.easy_pay_account_id,
                        'ApiKey': config.easy_pay.easy_pai_api_key
                    },
                    body: {
                        "type":"sale",
                        capture : {
                            "capture_date" : today,
                            "descriptive": "ANIECA"
                        },
                        "expiration_time": nextclock,
                        "value": element.value,
                        "method": "mb",
                        customer: {
                            "name":element.School_permit
                        }
                    },
                    json: true
                };
                // console.log(element.idReservation)
                // console.log("-----------ENVIADO PARA O EASY PAY" + JSON.stringify(options));
                //send request to easypay
                request(options, function (error, response, body) {
                    // console.log("RECEBIDO DO EASY PAY REQUEST " + JSON.stringify(body));
                    if (error) {
                        console.log(err);
                        // return res.status(500).json({ message: "Error generating EasyPay reference" });
                    } else if (response.statusCode === 201) {
                        var entity = body.method.entity
                        var reference = body.method.reference
                        //TODO o pagamento já não é por reserva, não faz sentido enviar nome do aluno
                        // var student = req.body.Student_name
                        // var tax_num = req.body.tax_num
                        var idEasyPay = body.id

                        // new method to patch multiple reservations
                        dbHandlers.Qgen_reservations.Qpatch_reservationArray({ idEasyPay , Atm_reference:reference}, element.idReservation, (error) => { // Unlocks reservation
                            if (error) {
                                console.log(error);
                                // return res.status(500).json({ message: 'There was an error while trying to update the reservation (idEasyPay).' });
                            } else {
                                // TODO ainda é para enviar através do examcenter?
                                // console.log("element.Exam_center_idExam_center" + element.Exam_center_idExam_center)
                                dbHandlers.Qgen_exam_center.Qget_smtpCredencials(id_exam_center, (err, smtpResults) => {
                                    if (err || smtpResults <= 0) {
                                        console.log(err);
                                        // return res.status(500).json({ message: "Error creating pendent payment" });
                                    } else {
                                        // // create reusable transporter object using the default SMTP transport
                                        let transporter = nodemailer.createTransport({
                                            host: smtpResults[0].SMTP_server,
                                            // port: 587,
                                            secure: false,
                                            auth: {
                                                user: smtpResults[0].SMTP_user, // generated ethereal user
                                                pass: smtpResults[0].SMTP_pass // generated ethereal password
                                            },
                                            tls: {
                                                rejectUnauthorized: false
                                            }
                                        });

                                        // get receiver info from school.permit
                                        dbHandlers.Qgen_school.Qget_byPermitSchool_Exam_Center(element.School_permit, id_exam_center,
                                                (err, school_info) => {
                                            if (err || school_info <= 0) {
                                                console.log(err);
                                                // return res.status(500).json({ message: "Error getting school email" });
                                            }else{
                                                // var toEmail = school_info[0].Email1 || school_info[0].Email2
                                                dbHandlers.Qgen_reservations.Qget_forEmailReservations(element.idReservation,async(e,email_info)=>{
                                                    if (e || email_info <= 0) {
                                                        console.log(e);
                                                    }else{
                                                        var text = '\nEntidade: ' + entity +
                                                            '\nReferência: ' + reference +
                                                            '\nValor: ' + element.value + '€.'
                                                        var html = htmlFiles.html_easyPay(nextclock, entity, reference, element, email_info);

                                                        //send mail with defined transport object
                                                        let info = await transporter.sendMail({
                                                            from: '"ANIECA" <' + smtpResults[0].SMTP_user + '>', // sender address
                                                            to: 'rui.branco@knowledgebiz.pt', // TODO change to toEmail
                                                            subject: 'Referência MB',
                                                            text, // plain text body
                                                            html, // html body
                                                            attachments: [{
                                                                filename: 'anieca.png',
                                                                path: __dirname + '/anieca.png', //TODO colocar imagem da anieca algures
                                                                cid: 'logo'
                                                            }]
                                                        });
                                                        // console.log(info);
                                                        // return res.status(200).json({ message: 'MB references sent.' });
                                                    };
                                                });
                                            };
                                        });
                                    };
                                });
                            };
                        });
                    };
                });
            });
        }else{
            // no pending reservations to be send
            console.log("No reservations pending for easy pay");
        };
    });
};

var updateMissingPayments = (req, res, next) => {
    var options = {
        url: config.easy_pay.easy_pay_url,
        method: 'GET',
        headers: {
            'AccountId': config.easy_pay.easy_pay_account_id,
            'ApiKey': config.easy_pay.easy_pai_api_key
        },
        json: true
    };

    dbHandlers.Qgen_pendent_payments.Qget_pendentPaymentsEasyPay((error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Error getting EasyPay ids." });
        } else {
            var ids = []
            Object.keys(result).forEach((key)=> {
                var row = result[key];
                ids.push(row.idEasyPay)
            });

            for (const element of ids) {
                options.url = config.easy_pay.easy_pay_url + element
                request(options, (error, response, body) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: "Error EasyPay request." });
                    } else if (response.statusCode === 404) {
                        console.log(element);
                        if (body === '404 page not found') {
                            console.log(body);
                            return res.status(404).json({ message: "URL not found." });
                        }
                        else {
                            console.log(element + ': not found on easyPay');
                        }

                    } else if (response.statusCode === 200) {
                        if (body.method.status === "active") {
                            console.log(element + ': ' + body.method.status);
                            var idEasyPay = element
                            var date = new Date().toISOString()
                            dbHandlers.Qgen_reservations.Qget_byIdEasyPay(idEasyPay, (err, results) => {
                                if (err) {
                                    console.log("Error getting info from reservation by EasyPay id.");
                                } else {
                                    if (results <= 0) {
                                        console.log(element + ': not found od db');
                                    } else {
                                        var { idPendent_payments, Exam_price, Exam_center_idExam_center } = results[0]
                                        dbHandlers.Qgen_payment.Qcreate_Payment([date, Exam_price], (err, results) => {
                                            if (err) {
                                                console.log("Error creating payment.");
                                            } else {
                                                var idPayment = results.insertId;
                                                var Transaction_num = null;
                                                var idT_Status_check = null;
                                                var Banks_idBanks = null;
                                                var Transaction_date = date.slice(0, 10)
                                                var School_idSchool = null
                                                var Payment_method_idPayment_method = 5

                                                dbHandlers.Qgen_transactions.Qcreate_Transactions(
                                                    [Transaction_num,
                                                        Exam_price,
                                                        Transaction_date,
                                                        Exam_center_idExam_center,
                                                        School_idSchool,
                                                        Payment_method_idPayment_method,
                                                        idT_Status_check, Banks_idBanks],
                                                    (err, results) => {
                                                        if (err) {
                                                            console.log(err);
                                                            console.log("Error creating transaction.");
                                                        } else {
                                                            var idTransaction = results.insertId;
                                                            dbHandlers.Qgen_transactions.Qupdate_Payment_Transaction(idTransaction, idPayment, (err) => {
                                                                if (err) {
                                                                    console.log(err);
                                                                    console.log("Error updating transaction.");
                                                                } else {
                                                                    dbHandlers.Qgen_pendent_payments.Qpatch_PendentPaymentValues({ Payments_idPayments: idPayment }, idPendent_payments, (err) => {
                                                                        if (err) {
                                                                            console.log(err);
                                                                            console.log("Error updating pendent payment.");
                                                                        } else {
                                                                            console.log('payment created for element ', element);
                                                                        };
                                                                    });
                                                                };
                                                            });
                                                        };
                                                    });
                                            };
                                        });
                                    };
                                };
                            });
                        };
                    };
                });
            };
        };
        return res.status(200).json({message: 'Done.'});
    });
};

var POST_easyPay = (req, res, next) => {
    if (req.headers["x-easypay-code"] === config.easy_pay.easy_pay_header_code) {
        var idEasyPay = req.body.id;
        var date = new Date().toISOString();
        dbHandlers.Qgen_reservations.Qget_byIdEasyPay(idEasyPay, (err, reservation) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Error getting info from reservation by EasyPay id." });
            } else {
                if (reservation.length <= 0) {
                    return res.status(400).json({ message: "EasyPay ID not found." });
                } else {
                    var {idPendent_payments,totalprice,Exam_center_idExam_center}=reservation[0];
                    dbHandlers.Qgen_payment.Qcreate_Payment([date, totalprice],(err,results)=>{
                        if(err){
                            console.log(err);
                            return res.status(500).json({message: "Error creating payment."});
                        }else{
                            var idPayment = results.insertId;
                            var Transaction_num = null;
                            var idT_Status_check = null;
                            var Banks_idBanks = null;
                            var Transaction_date = date.slice(0, 10);
                            var School_idSchool = reservation[0].idschool;
                            var Payment_method_idPayment_method = 5;

                            dbHandlers.Qgen_transactions.Qcreate_Transactions([Transaction_num,totalprice,Transaction_date,Exam_center_idExam_center,
                                        School_idSchool,Payment_method_idPayment_method,idT_Status_check, Banks_idBanks],(err, results) => {
                                if(err){
                                    console.log(err);
                                    return res.status(500).json({message:"Error creating transaction."});
                                }else{
                                    var idTransaction = results.insertId;
                                    dbHandlers.Qgen_transactions.Qupdate_Payment_Transaction(idTransaction,idPayment,(err)=>{
                                        if(err){
                                            console.log(err);
                                            return res.status(500).json({message:"Error updating transaction."});
                                        }else{
                                            reservation.forEach(element => {
                                                dbHandlers.Qgen_pendent_payments.Qpatch_PendentPaymentValues({Payments_idPayments:idPayment},
                                                        element.idPendent_payments,(err)=>{
                                                    if(err){
                                                        console.log(err);
                                                        // return res.status(500).json({message:"Error updating pendent payment."});
                                                    }else{
                                                        // return res.status(200).json({message:'OK'});
                                                    };
                                                });
                                            });
                                            return res.status(200).json({message:'OK'});
                                            // dbHandlers.Qgen_pendent_payments.Qpatch_PendentPaymentValues({Payments_idPayments:idPayment},
                                            //             idPendent_payments,(err)=>{
                                            //     if(err){
                                            //         console.log(err);
                                            //         return res.status(500).json({message:"Error updating pendent payment."});
                                            //     }else{
                                            //         return res.status(200).json({message:'OK'});
                                            //     };
                                            // });
                                        };
                                    });
                                };
                            });
                        };
                    });
                };
            };
        });
    }else{
        return res.status(400).json({message:"Wrong header x-code."});
    };
};

module.exports = {
    bulk,
    updateMissingPayments,
    POST_easyPay
} 