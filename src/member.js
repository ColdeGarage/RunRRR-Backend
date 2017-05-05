var request = require('request');
var events = require('events');
var path = require('path');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require(path.join(ROOT_PATH, 'src/db.js'));
var connection = db.conn();

const timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//return member's status
exports.liveordie = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var uid = parseInt(req.body.uid);
	var info = {status : req.body.status};
	//parse string to bool and invert
	if ((info.status == 'true') || (info.status == '1')) 
		info.status = 0;
	else if (info.status == 'false' || (info.status == '0')) 
		info.status = 1;
	else 
		info.status = undefined;

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'member';
	ret.action = 'liveordie';

	fire.on('check', function(){
		var check = !isNaN(operator_uid) &&
			(token != undefined) &&
			!isNaN(uid) &&
			(info.status != undefined);

		if (check) {
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /member/liveordie without operator_uid, \
				token, uid, or status.');

			fire.emit('send');
		}
	});
	fire.on('auth', function(){		
		connection.query('SELECT * FROM secret WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /member/liveordie auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_code>0) {
				fire.emit('search');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /member/liveordie \
					(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search', function(){
		connection.query('SELECT * FROM member WHERE uid = '+uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /member/liveordie (uid='+uid+') \
					find with database error:', err);
				
				fire.emit('send');
			}
			else if (rows.length == 0){
				ret.brea = 3;
				console.log('Failed! /member/liveordie (uid='+uid+') \
					cannot be found in database.');
				
				fire.emit('send');
			}
			else {
				fire.emit('update');
			}
		});
	});
	fire.on('update', function(){
		connection.query('UPDATE member SET ? WHERE uid = '+uid, info,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /member/liveordie (uid='+uid+') \
					with database error:', err);
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					status : info.status
				};
				if (result.changedRows) 
					console.log('Success! /member/liveordie (uid='+uid+') \
						change (status='+info.status+').');
				else 
					console.log('Success! /member/liveordie (uid='+uid+') \
						doesn\'t change.');
			}
			
			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});
	
	fire.emit('check');
}

//update member's location
exports.update = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var member = new Object;
	member.uid = parseInt(req.body.uid);
	member.position_e = parseFloat(req.body.position_e);
	member.position_n = parseFloat(req.body.position_n);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'member';
	ret.action = 'update';

	fire.on('check', function(){
		var check = !isNaN(operator_uid) && (token!=undefined);
		for (var key in member) {
			check = check && !isNaN(member[key]);
		}

		if (check) {
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /member/update without operator_uid, \
				token, position_n, or position_e.');
			
			fire.emit('send');
		}
	});
	fire.on('auth', function(){
		connection.query('SELECT * FROM secret WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /member/update auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_code==0) {
				fire.emit('search');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /member/update (uid='+operator_uid+') \
					auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search', function(){
		connection.query('SELECT * FROM member WHERE uid = '+member.uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /member/update (uid'+member.uid+') \
					find with database error:', err);
				
				fire.emit('send');
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /member/update (uid'+member.uid+') \
					is not in database.');
			}
			else {
				fire.emit('update');
			}
		});
	});
	fire.on('update', function(){
		connection.query('UPDATE member SET ? WHERE uid = '+member.uid, member,
		function(err, result){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /member/update (uid'+member.uid+') \
					with database error:', err);
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					valid_area : 1
				}
				if (result.changedRows) 
					console.log('Success! /member/update (uid'+member.uid+') \
						successfully.');
				else 
					console.log('Success! /member/update (uid'+member.uid+') \
						doesn\'t change.');
			}

			fire.emit('send');
		});
	});
	fire.on('send',function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	fire.emit('check');
}

//return member's information
exports.read = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var uid = parseInt(req.query.uid);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'member';
	ret.action = 'read';

	fire.on('check', function(){
		var check = !isNaN(operator_uid) &&
			(secret.token!=undefined);

		if (check) {
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /member/read without operator_uid or token.');
			
			fire.emit('send');
		}
	});
	fire.on('auth', function(){
		connection.query('SELECT * FROM secret WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /member/read auth with db error: ', err);
				
				fire.emit('send');
			}
			else if ((token==rows[0].token) && (rows[0].auth_code!=null)) {
				if (!isNaN(uid))
					fire.emit('search_uid');
				else 
					fire.emit('search');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /member/read (uid='+operator_uid+') \
					auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search_uid', function(){
		connection.query('SELECT * FROM member WHERE uid = '+uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /member/read (uid='+uid+') \
					with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /member/read (uid='+uid+') \
					is not in database.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				}
				console.log('Success! /member/read (uid='+uid+') \
					successfully.');
			}
			fire.emit('send');
		});
	});
	fire.on('search', function(){
		connection.query('SELECT * FROM member',
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /member/read with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /member/read database is still empty.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				}
				console.log('Success! /member/read successfully.');
			}

			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});
	
	fire.emit('check');
}
//edit member's money
exports.money = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var uid = parseInt(req.body.uid);
	var amount = parseInt(req.body.money_amount);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'member';
	ret.action = 'money';

	fire.on('check', function(){
		var check = !isNaN(operator_uid) &&
			(secret.token!=undefined) &&
			!isNaN(uid) &&
			!isNaN(amount);
		if (check){
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /member/money without operator_uid, \
				token, uid, or money_amount.');

			fire.emit('send');
		}
	});
	fire.on('auth', function(){
		connection.query('SELECT * FROM secret WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /member/money auth with db error: ', err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_code>0) {
					fire.emit('search');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /member/money (uid='+operator_uid+') \
					auth failed.');
				
				fire.emit('send');
			}
		});
	});
	var info;
	fire.on('search', function(){
		connection.query('SELECT money FROM member WHERE uid = '+uid,
		function(err, rows){
			if (err){
				ret.brea = 1;
				console.log('Failed! /member/money (uid='+uid+') \
					find with database error:', err);

				fire.emit('send');
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /member/money (uid='+uid+') \
					is not in database.');

				fire.emit('send');
			}
			else {
				info = rows;
				info.money = info.money + amount;
				fire.emit('update');
			}
		});
	});
	fire.on('update', function(){
		connection.query('UPDATE member SET ? WHERE uid = '+uid, info,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /member/money (uid='+uid+') \
					with database error:', err);
			}
			else {
				ret.brea = 0;
				if (result.changedRows) 
					console.log('Success! /member/money (uid='+uid+') \
						successfully.');
				else 
					console.log('Success! /member/money (uid='+uid+') \
						doesn\'t change.');
			}
			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	fire.emit('check');
}
//get emergency
exports.callhelp = function(req, res){
	console.log('******Help!!!******');
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var member = new Object;
	member.uid = parseInt(req.body.uid);
	member.position_e = parseFloat(req.body.position_e);
	member.position_n = parseFloat(req.body.position_n);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'member';
	ret.action = 'callhelp';

	fire.on('check', function(){
		var check = !isNaN(operator_uid) && (secret.token!=undefined);
		for (var key in member) {
			check = check && !isNaN(member[key]);
		}
		if (check){
			console.log('At ('+member.position_e+','+member.position_n+')');
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /member/liveordie without operator_uid, \
				token, uid, or location.');

			fire.emit('send');
		}
	});
	fire.on('auth', function(){
		connection.query('SELECT * FROM secret WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /member/callhelp auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_code>0) {
					fire.emit('search');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /member/callhelp (uid='+operator_uid+') \
					auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search', function(){
		connection.query('SELECT name FROM member WHERE uid = '+member.uid,
		function(err, rows){
			if (err){
				ret.brea = 1;
				console.log('Failed! /member/callhelp (uid='+member.uid+') \
					find with database error:' ,err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /member/callhelp (uid='+member.uid+') \
					is not in database.');
			}
			else {
				ret.brea = 0;
				console.log(rows.name+' press the help button!');
			}
			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('******Help!!!******');
	});

	fire.emit('check');
}

// Login auth
exports.login = function(req, res){
	var fire = new events.EventEmitter;

	var email = req.body.email;
	var password = req.body.password;

	var ret = new Object;
	ret.object = 'member';
	ret.action = 'login';

	var secret = new Object;

	fire.on('check', function(){
		var check = !isNaN(operator_uid) && (secret.token!=undefined) &&
			(email!=null) && (password!=null);
		if (check){
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /member/login without operator_uid, \
				token, email, or password.');

			fire.emit('send');
		}
	});
	fire.on('auth', function(){
		var URL = 'http://www.ee.nthu.edu.tw/engcamp/api/auth.php';
		request.get({url:URL+'?token=nthuee&email='+email+'&id='+password},
			function optionalCallback(err, httpResponse, body) {
				if (err) {
					ret.uid = 0;
					ret.brea = 1;
					console.log('Failed! (email='+email+') \
						Login auth access failed:', err);

					fire.emit('send');
				}
				else if (httpResponse.statusCode == 200){
					var data = JSON.parse(body);
					ret.uid = parseInt(data.rid);
					ret.token = data.token;
					ret.payload = {
						type : 'Attribute Name',
						correct : 0
					}
					console.log('Success! (email='+email+') \
						Login auth access success. \
						User (uid='+data.rid+') auth success.');
					
					secret = {
						uid: ret.uid,
						token: data.token,
						auth_code: data.auth_code
					}
					fire.emit('store');
				}
				else{
					ret.uid = 0;
					ret.brea = 0;
					ret.payload = {
						type : 'Attribute Name',
						correct : 1
					}
					console.log('Failed! (email='+email+') \
						Login auth access success. \
						User auth failed.');

					fire.emit('send');
				}
			}
		);
	});
	fire.on('store', function(){
		connection.query('INSERT INTO token SET ?', secret,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /member/login store secret into \
					db error:', err);
			}
			else {
				ret.brea = 0;
			}
			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	fire.emit('check');
}