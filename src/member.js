var path = require('path');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require(path.join(ROOT_PATH, 'src/db.js'));
var request = require('request')
var connection = db.conn();
var timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//return member's status
exports.liveordie = function(req, res){
	var uid = parseInt(req.body.uid);
	var info = {status : req.body.status};

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'member';
	ret.action = 'liveordie';

	var check = !isNaN(ret.uid) && !isNaN(uid);
	//parse string to bool and invert
	if ((info.status == 'true') || (info.status == '1')) info.status = 0;
	else if (info.status == 'false' || (info.status == '0')) info.status = 1;
	else check = 0;

	if (check) {
		connection.query('SELECT * FROM member WHERE uid = '+uid, function(err, rows){
			if (err) {
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /member/liveordie (uid='+uid+') find with database error:', err);
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /member/liveordie (uid='+uid+') cannot find in database.');
				}
				else{
					connection.query('UPDATE member SET ? WHERE uid = '+uid, info, function(err, result){
						if (err){
							ret.brea = 1;
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							console.log('Failed! /member/liveordie (uid='+uid+') with database error:', err);
						}
						else {
							ret.brea = 0;
							ret.payload = {
								type : 'Attribute Name',
								status : info.status
							};
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							if (result.changedRows) 
								console.log('Success! /member/liveordie (uid='+uid+') change (status='+info.status+').');
							else 
								console.log('Success! /member/liveordie (uid='+uid+') doesn\'t change.');
						}
					});
				}
			}
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /member/liveordie without operator_uid, uid, or status.');
	}
}

//update member's location
exports.update = function(req, res){
	var member = new Object;
	member.uid = parseInt(req.body.uid);
	member.position_e = parseFloat(req.body.position_e);
	member.position_n = parseFloat(req.body.position_n);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'member';
	ret.action = 'update';

	var check = 1;
	for (var key in member) {
		check = check && !isNaN(member[key]);
	}
	check = check && !isNaN(ret.uid);
	if (check) {
		connection.query('SELECT * FROM member WHERE uid = '+member.uid, function(err, rows){
			if (err) {
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /member/update (uid'+member.uid+') find with database error:', err);
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /member/update (uid'+member.uid+') is not in database.');
				}
				else{
					connection.query('UPDATE member SET ? WHERE uid = '+member.uid, member, function(err, result){
						if (err) {
							ret.brea = 1;
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							console.log('Failed! /member/update (uid'+member.uid+') with database error:', err);
						}
						else {
							ret.brea = 0;
							ret.payload = {
								type : 'Attribute Name',
								valid_area : 1
							}
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							if (result.changedRows) 
								console.log('Success! /member/update (uid'+member.uid+') successfully.');
							else 
								console.log('Success! /member/update (uid'+member.uid+') doesn\'t change.');
						}
					});
				}
			} 
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /member/update without operator_uid, position_n, or position_e.');
	}
}

//return member's information
exports.read = function(req, res){
	var uid = parseInt(req.query.uid);

	var ret = new Object;
	ret.uid = parseInt(req.query.operator_uid);
	ret.object = 'member';
	ret.action = 'read';

	if (!isNaN(ret.uid)) {
		if (!isNaN(uid)) {
			connection.query('SELECT * FROM member WHERE uid = '+uid, function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /member/read (uid='+uid+') with database error:', err);
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Failed! /member/read (uid='+uid+') is not in database.');
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : 'Objects',
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Success! /member/read (uid='+uid+') successfully.');
					}
				} 
			});
		}
		else {
			connection.query('SELECT * FROM member', function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /member/read with database error:', err);
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Failed! /member/read database is still empty.');
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : 'Objects',
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Success! /member/read successfully.');
					}
				}
			});
		}
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /member/read without operator_uid.');
	}
}
//edit member's money
exports.money = function(req, res){
	var uid = parseInt(req.body.uid);
	var amount = parseInt(req.body.money_amount);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'member';
	ret.action = 'money';

	var info;
	var check = !isNaN(ret.uid) && !isNaN(uid) && !isNaN(amount);
	if (check) {
		connection.query('SELECT money FROM member WHERE uid = '+uid, function(err, rows){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /member/money (uid='+uid+') find with database error:', err);
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /member/money (uid='+uid+') is not in database.');
				}
				else {
					ret.brea = 0;
					info = rows;
					connection.query('UPDATE member SET ? WHERE uid = '+uid, info, function(err, result){
						if (err){
							ret.brea = 1;
							console.log('Failed! /member/money (uid='+uid+') with database error:', err);
						}
						else {
							ret.brea = 0;
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							if (result.changedRows) 
								console.log('Success! /member/money (uid='+uid+') successfully.');
							else 
								console.log('Success! /member/money (uid='+uid+') doesn\'t change.');
						}
					});
				}
			}
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /member/money without operator_uid, uid, or money_amount.');
	}
}
//get emergency
exports.callhelp = function(req, res){
	var member = new Object;
	member.uid = parseInt(req.body.uid);
	member.position_e = parseFloat(req.body.position_e);
	member.position_n = parseFloat(req.body.position_n);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'member';
	ret.action = 'callhelp';

	var check = 1;
	for (var key in member) {
		check = check && !isNaN(member[key]);
	}
	check = check && !isNaN(ret.uid);
	if (check) {
		ret.brea = 0;
		console.log('******Help!!!******');
		console.log('At ('+member.position_e+','+member.position_n+')');

		connection.query('SELECT name FROM member WHERE uid = '+member.uid, function(err, rows){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /member/callhelp (uid='+member.uid+') find with database error:' ,err);
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /member/callhelp (uid='+member.uid+') is not in database.');
				}
				else {
					ret.brea = 0;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log(rows.name+' press the help button!');
				}
			}
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('******Help!!!******');
		console.log('uid = '+member.uid);
		console.log('/member/callhelp without operator_uid, uid, position_e, or position_n');
	}
}

// Login auth
exports.login = function(req, res){
	var email = req.body.email;
	var password = req.body.password;

	var ret = new Object;
	ret.object = 'member';
	ret.action = 'login';

	var check = (email!=null) && (password!=null);
	if (check) {
		request.get({url:'http://www.ee.nthu.edu.tw/engcamp/api/auth.php?token=nthuee&email='+email+'&id='+password},
			function optionalCallback(err, httpResponse, body) {
				if (err) {
					ret.uid = 0;
					ret.brea = 1;
					ret.payload = {
						type : 'Attribute Name',
						correct : 1
					}
					console.log('Failed! (email='+email+') Login auth access failed:', err);

				}
				else if (httpResponse.statusCode == 200){
					var data = JSON.parse(body);
					ret.uid = parseInt(data.rid);
					ret.brea = 0;
					ret.payload = {
						type : 'Attribute Name',
						correct : 0
					}
					console.log('Success! (email='+email+') Login auth access success. User (uid='+data.rid+') auth success.');
				}
				else{
					ret.uid = 0;
					ret.brea = 0;
					ret.payload = {
						type : 'Attribute Name',
						correct : 1
					}
					console.log('Failed! (email='+email+') Login auth access success. User auth failed.');
				}
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
			}
		);
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! Login without email or password.');
	}
}