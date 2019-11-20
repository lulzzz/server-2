// get account by user
var Qget_byUserAccount = (user,cb)=>{
	return myQuery('SELECT * FROM Account WHERE Account.User = ? LIMIT 1',
							[user],(error, results, fields)=>{
		error ? cb(error) : cb(false,results[0]);
	});
};

// get account by id
var Qget_byIdAccount = (id,cb)=>{
	return myQuery('SELECT * FROM Account WHERE Account.idAccount = ?',
							[id],(error, results, fields)=>{
		error ? cb(error) : cb(false,results[0]);
	});
};

// get the permissions for given user
var Qget_byUserPermissions = (user,cb)=>{
	return myQuery ('SELECT t_permission.action, t_resource.Resource_name '+
							'FROM t_permission, t_resource, functionality, role, account '+
							'WHERE t_permission.idt_permission = functionality.T_permission_idT_permission '+
        					'AND t_resource.idT_resource = functionality.T_resource_idT_resource '+
        					'AND functionality.Role_idRole = role.idRole '+
        					'AND account.Role_idRole = role.idRole '+
        					'AND account.User = ? ORDER BY t_resource.Resource_name ASC',[user],
        					(error,results,fields)=>{
		error ? cb(error) : cb(false,results);	
	});
};

var Qget_AllAcounts = (cb)=>{
	return myQuery('SELECT role.role_name,account.Exam_center_name,account.User,account.User_email,account.status,account.idAccount,school.school_name '+
						'FROM account LEFT JOIN role ON account.Role_idRole=Role.idRole '+
						'LEFT JOIN School ON account.School_idSchool=School.idSchool',
						[null],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);
	});
};

// create record for student 
var Qcreate_Account = (values,cb)=>{
	return myQuery ('INSERT INTO Account (User,Hash,Salt,User_name,User_email,In_session,Createdate,Updatedate,'+
							'Status,Exam_center_idExam_center,Exam_center_name,Role_idRole,School_idSchool) values (?)',
							[values],(error, results, fields)=>{
		error ? cb(error) : cb(false,results);			
	});
};

// create record for student 
var Qupdate_Account = (values,idrole,cb)=>{
	return myQuery ('UPDATE Account SET ? WHERE Account.idAccount = ?',[values,idrole],
							(error, results, fields)=>{
		error ? cb(error) : cb(false,results);			
	});
};

module.exports = function(myQuery){
	return {
		Qget_byUserAccount,
		Qget_byIdAccount,
		Qget_byUserPermissions,
		Qget_AllAcounts,
		Qcreate_Account,
		Qupdate_Account
	}
}