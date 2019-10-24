var express = require('express');
var bodyParser = require('body-parser');
var http = require("http");
const path= require('path');
const cors=require('cors');
var schedule = require('node-schedule');
// -------------------------------------
var controllers = require("./controllers");
var dbHandlers = require("./db");
var passport=require('passport');
require("./controllers").passport;
// var passport = require("./controllers").passport;
const publicPath=path.join(__dirname, '../public');

var urlencodedParser = bodyParser.urlencoded({ extended: false });

var config = require('./config.json');
var port = process.env.PORT || config.backend.port;

var app = express();
var server = http.createServer(app);

app.use(express.static(publicPath));
app.use(cors());
// requires the use bodyParser for messages
app.use(bodyParser.json());

// ---------------------passport---------------------
app.use(passport.initialize());
app.use(passport.session());

// requires the use of authorizathion for every route made
// app.use(controllers.authorization);

// Accounts routes
app.use(require("./controllers/middleware/authentication"));
app.post('/api/login',controllers.authorization.login);
app.post('/api/registo',controllers.authorization.register);
// TODO OPERATOR EDIT
// ------------------------------------------------------------------------------
// Resources/Permission routes
app.get('/api/recursos',controllers.resources.getList_resources);
// app.get('/api/crud',controllers.permissions.getList_permissions);
app.post('/api/teste',controllers.bookings.createBooking);
// ------------------------------------------------------------------------------
// Roles routes
app.get('/api/permissoes',controllers.roles.getList_AllRoles);
app.post('/api/permissoes',controllers.roles.create_Roles);
// app.post('/api/permissoes',controllers.permits.testfunc);
app.delete('/api/permissoes',controllers.roles.delete_Roles);
app.patch('/api/permissoes',controllers.roles.update_Roles);
// ------------------------------------------------------------------------------
// Exam_center routes
app.get('/api/centro-exames/:idExam_center',controllers.exam_center.getList_Exam_center);
app.post('/api/centro-exames',controllers.exam_center.createExam_center);
app.delete('/api/centro-exames',controllers.exam_center.deleteExam_center);
app.patch('/api/centro-exames',controllers.exam_center.updateExam_center);
// ------------------------------------------------------------------------------
// Schools routes
app.get('/api/centro-exames/:idExam_center/escolas',controllers.school.getList_School_Exam_Center);
app.post('/api/escolas',controllers.school.createSchool);
app.delete('/api/escolas',controllers.school.deleteSchool);
app.patch('/api/escolas',controllers.school.updateSchool);
// ------------------------------------------------------------------------------
// Student routes
app.get('/api/centro-exames/:idExam_center/alunos',controllers.student.getList_Student_Exam_Center);
app.post('/api/alunos',controllers.student.createStudent);
app.delete('/api/alunos',controllers.student.deleteStudent);
app.patch('/api/alunos',controllers.student.updateStudent);
// ------------------------------------------------------------------------------
// Student Notes routes
app.post('/api/alunos-anotacoes',controllers.student_note.createStudent_note);
app.delete('/api/alunos-anotacoes', controllers.student_note.deleteStudent_note);
app.patch('/api/alunos-anotacoes', controllers.student_note.updateStudent_note);
// ------------------------------------------------------------------------------
// Examiners routes
app.get('/api/centro-exames/:idExam_center/examinadores',controllers.examiner.getList_Examiner_Exam_Center);
app.post('/api/examinadores',controllers.examiner.createExaminer);
app.delete('/api/examinadores',controllers.examiner.deleteExaminer);
app.patch('/api/examinadores',controllers.examiner.updateExaminer);
// ------------------------------------------------------------------------------
// Exam_types routes
app.get('/api/tipo-exames',controllers.exam_type.getList_Exam_type);
app.post('/api/tipo-exames',controllers.exam_type.createExam_type);
app.delete('/api/tipo-exames',controllers.exam_type.deleteExam_type);
app.patch('/api/tipo-exames',controllers.exam_type.updateExam_type);
// ------------------------------------------------------------------------------
// Examiner qualifications routes
app.get('/api/examinador-habilitacoes',controllers.examiner_qualification.getList_Examiner_qualifications);
app.post('/api/examinador-habilitacoes',controllers.examiner_qualification.createExaminer_qualification);
app.delete('/api/examinador-habilitacoes',controllers.examiner_qualification.deleteExaminer_qualification);
// ------------------------------------------------------------------------------
// Booking routes
app.get('/api/centro-exames/:idExam_center/exames-marcados',controllers.bookings.getList_Bookings_Exam_Center);
app.post('/api/exames-marcados',controllers.bookings.createBooking);
app.delete('/api/exames-marcados',controllers.bookings.deleteBooking);
app.patch('/api/exames-marcados',controllers.bookings.updateBooking);
// ------------------------------------------------------------------------------
// Exam routes
app.get('/api/centro-exames/:idExam_center/exames',controllers.exams.getList_Exam);
app.post('/api/exames',controllers.exams.createExam); //for advance search purpose
app.delete('/api/exames',controllers.exams.deleteExam);
app.patch('/api/exames',controllers.exams.updateExam);
// ------------------------------------------------------------------------------
// Pautas routes
app.get('/api/centro-exames/:idExam_center/pautas',controllers.pautas.getList_Pauta_Exam_Center);
app.post('/api/centro-exames/:idExam_center/pautas',controllers.pautas.createPauta);
app.delete('/api/pautas',controllers.pautas.deletePauta);
app.patch('/api/pautas',controllers.pautas.updatePauta);
// ------------------------------------------------------------------------------
// Categories routes
app.get('/api/categorias',controllers.category.getAllCategories);
app.post('/api/categorias',controllers.category.createCategory);
app.delete('/api/categorias',controllers.category.deleteCategory);
app.patch('/api/categorias',controllers.category.updateCategory);
// ------------------------------------------------------------------------------
// Exam roads available routes
app.get('/api/centro-exames/:idExam_center/rotas-de-exame',controllers.exam_routes.getAllExam_routes);
app.post('/api/rotas-de-exame',controllers.exam_routes.createExam_route);
app.delete('/api/rotas-de-exame',controllers.exam_routes.deleteExam_route);
app.patch('/api/rotas-de-exame',controllers.exam_routes.updateExam_route);
// ------------------------------------------------------------------------------
// Identification types routes
app.get('/api/tipos-id',controllers.id_type.getList_T_ID_type);
app.post('/api/tipos-id',controllers.id_type.create_T_ID_type);
app.delete('/api/tipos-id',controllers.id_type.delete_T_ID_type);
app.patch('/api/tipos-id',controllers.id_type.update_T_ID_type);
// ------------------------------------------------------------------------------
// Pautas results routes
app.get('/api/exames-resultados',controllers.exam_results.getListExamResult);
app.post('/api/exames-resultados',controllers.exam_results.createExamResult);
app.delete('/api/exames-resultados',controllers.exam_results.deleteExamResult);
app.patch('/api/exames-resultados',controllers.exam_results.updateExamResult);
// ------------------------------------------------------------------------------
// Exam Status routes
app.get('/api/estado-exame', controllers.exam_status.getExamStatus);
app.post('/api/estado-exame', controllers.exam_status.createExamStatus);
app.delete('/api/estado-exame', controllers.exam_status.deleteExamStatus);
app.patch('/api/estado-exame', controllers.exam_status.updateExamStatus);
// ------------------------------------------------------------------------------
// Exam centers work hours routes
app.get('/api/centro-exames/:idExam_center/horario',controllers.work_hours.getWorkHoursByCenter);
app.post('/api/horario',controllers.work_hours.createWorkHour);
app.delete('/api/horario',controllers.work_hours.deleteWorkHour);
app.patch('/api/horario',controllers.work_hours.updateWorkHour);
// ------------------------------------------------------------------------------
// Delegations routes
app.get('/api/delegacoes',controllers.delegations.getListDelegation);
app.post('/api/delegacoes',controllers.delegations.createDelegation);
app.delete('/api/delegacoes',controllers.delegations.deleteDelegation);
app.patch('/api/delegacoes',controllers.delegations.updateDelegation);
// ------------------------------------------------------------------------------
// Banks routes
app.get('/api/bancos',controllers.banks.getList_Banks);
app.post('/api/bancos',controllers.banks.create_Bank);
app.delete('/api/bancos',controllers.banks.delete_Bank);
app.patch('/api/bancos',controllers.banks.update_Bank);
// ------------------------------------------------------------------------------
// Tax routes
app.get('/api/taxas',controllers.tax.getList_T_tax);
app.post('/api/taxas',controllers.tax.create_T_tax);
app.delete('/api/taxas',controllers.tax.delete_T_tax);
app.patch('/api/taxas',controllers.tax.update_T_tax);
// ------------------------------------------------------------------------------
//  Reservations routes
app.get('/api/centro-exames/:idExam_center/reservas', controllers.reservation.getList_ReservationsByIdTimeslot);
app.post('/api/centro-exames/:idExam_center/reservas', controllers.reservation.postList_Reservations);
app.delete('/api/centro-exames/:idExam_center/reservas', controllers.reservation.deleteList_reservations);
app.patch('/api/centro-exames/:idExam_center/reservas', controllers.reservation.patchList_Reservations);
// ------------------------------------------------------------------------------
// Timeslot routes
app.get('/api/centro-exames/:idExam_center/timeslot', controllers.timeslot.getList_TimeslotByWeek);
app.post('/api/centro-exames/:idExam_center/timeslot', controllers.timeslot.postList_Timeslot);
app.patch('/api/centro-exames/:idExam_center/timeslot', controllers.timeslot.patchList_Timeslot);
app.delete('/api/centro-exames/:idExam_center/timeslot', controllers.timeslot.deleteList_Timeslot);
// ------------------------------------------------------------------------------
// Groups routes
app.get('/api/grupos', controllers.groups.get_dailyGroups);
app.post('/api/centro-exames/:idExam_center/grupos', controllers.groups.postList_Groups);
app.patch('/api/centro-exames/:idExam_center/grupos', controllers.groups.patchList_Groups);
// ------------------------------------------------------------------------------
// Pendent Payments routes
app.get('/api/centro-exames/:idExam_center/pagamentos-pendentes',controllers.pendent_payments.getList_Pendent_Payments);
// Pendent payments are being created automatically by exams
// Pendent payments can't be deleted
// Pendent payments can't be patched through route
// ------------------------------------------------------------------------------
// Transactions routes
app.get('/api/centro-exames/:idExam_center/movimentos',controllers.transactions.getList_Transactions);
app.post('/api/movimentos',controllers.transactions.create_Transactions);
app.delete('/api/movimentos',controllers.transactions.delete_Transaction);
app.patch('/api/movimentos',controllers.transactions.update_Transaction);
// ------------------------------------------------------------------------------
// Metodos pagamentos routes
app.get('/api/tipos-pagamento',controllers.payment_methods.getList_Payment_Method);
app.post('/api/tipos-pagamento',controllers.payment_methods.createPayment_Method);
app.delete('/api/tipos-pagamento',controllers.payment_methods.deletePayment_Method);
app.patch('/api/tipos-pagamento',controllers.payment_methods.updatePayment_Method);
// ------------------------------------------------------------------------------
// Pagamentos routes
app.get('/api/centro-exames/:idExam_center/pagamentos',controllers.payments.getList_Payments);
app.post('/api/pagamentos',controllers.payments.create_Payment);
app.delete('/api/pagamentos',controllers.payments.delete_Payment);
app.patch('/api/pagamentos',controllers.payments.update_Payment);
// ------------------------------------------------------------------------------
// SICC routes
app.post('/api/centro-exames/:idExam_center/sicc',controllers.imtt.POST_sicc);
// ------------------------------------------------------------------------------
// SICC status routes
app.get('/api/estado-sicc',controllers.sicc_status.getSiccStatus);
// ------------------------------------------------------------------------------
// EasyPay Routes
app.get('/api/easyPay',controllers.easyPay.updateMissingPayments);
app.post('/api/easyPay',controllers.easyPay.POST_easyPay);
// ------------------------------------------------------------------------------
// Accounts routes
app.get('/api/operadores',controllers.authorization.get_Accounts);
// ------------------------------------------------------------------------------
// Listagens routes
// app.post('/api/centro-exames/:idExam_center/listagens',controllers.Lists.getLists);

// Route External API location
app.get('/api/localizacao',controllers.location.getlocation);

// --------------Schedule job-----------------------
var rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, 6];
rule.hour = config.easy_pay.timer_hour;
rule.minute = config.easy_pay.timer_min;
rule.dayOfWeek = [0, new schedule.Range(0, 6)];

var j = schedule.scheduleJob(rule, () => {
	console.log('EasyPay pending reservations');
	dbHandlers.Qgen_exam_center.Qget_Exam_center_ID((e,exam_center)=>{
		if (e){
			console.log(e);
		}else if (exam_center.length<=0){
			console.log("No exam centers configured");
		}else{
			exam_center.forEach(element => {
				console.log(element)
				controllers.easyPay.bulk(element.idExam_center);
			});
		};
	});
});
// --------------------------------------------

server.listen(port, () => {
  console.log(`Started on port ${port}`);
});

