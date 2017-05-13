var fs = require('fs');
var events = require('events');
var path = require('path');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require('./db.js');
var connection = db.conn();
if (process.env.NODE_ENV === 'production'){
    var config = require(path.join(ROOT_PATH, 'src/config_production.json'));
} else if (process.env.NODE_ENV === 'test') {
    var config = require(path.join(ROOT_PATH, 'src/config_staging.json'));
} else {
    throw 'Environment setting error! Please set NODE_ENV Environment variable';
}

const FILE_PREFIX = config.file_prefix;
const IMAGE_DIR = config.image_dir;
const timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//create a new report
exports.create = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var report = new Object;
	report.uid = operator_uid;
	report.mid = parseInt(req.body.mid);
	report.url = 'report-m'+report.mid+'-u'+report.uid+'.jpg';
	report.status = 0;
	report.time = new Date((new Date).getTime()-timezone*60*1000);
	
	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'report';
	ret.action = 'create';

	fire.on('check', function(){
		var check = !isNaN(operator_uid) && (token!=undefined) &&
			!isNaN(report.mid) && (req.body.image!=undefined);

		if (check) {
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /report/create without operator_uid, '
				+'token, mid or image.');
			
			fire.emit('send');
		}
	});
	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /report/create auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_level==10) {
				fire.emit('create');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /report/create '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('create', function(){
		connection.query('INSERT INTO report SET ?', report,
    	function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /report/create (mid='+report.mid+') '
					+'(uid='+report.uid+') with database error:', err);
			}
			else {
				var filename = path.join(ROOT_PATH, FILE_PREFIX,
					IMAGE_DIR, report.url);
				fs.writeFile(filename, new Buffer(req.body.image, 'base64'), 
					function(err){
		    		if (err) 
		    			console.log('Error! /report/create write image '
		    				+'with error:', err);
		    	});

				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					rid : result.insertId
				}
				console.log('Success! /report/create (mid='+report.mid+') '
					+'(uid='+report.uid+') successfully.');
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

//check the report status
exports.check = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var report = new Object;
	report.rid = parseInt(req.body.rid);
	report.status = parseInt(req.body.status);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'report';
	ret.action = 'check';

	fire.on('check', function(){
		var check = !isNaN(operator_uid) && (token!=undefined) &&
			!isNaN(report.rid) && !isNaN(report.status);

		if (check){
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /report/check without operator_uid, '
				+'token, rid or status.');
			
			fire.emit('send');
		}
	});
	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /report/check auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('search');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /report/check '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search', function(){
		connection.query('SELECT * FROM report WHERE rid = '+report.rid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /report/check (rid='+report.rid+') '
					+'find rid with database error:', err);

				fire.emit('send');
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /report/check (rid='+report.rid+') '
					+'is not in database.');

				fire.emit('send');
			}
			else {
				fire.emit('update');
			}
		});
	});
	fire.on('update', function(){
		connection.query('UPDATE report SET ? WHERE rid = '+report.rid, report,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /report/check (rid='+report.rid+') '
					+'update with database error:', err);
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type: 'Attribute Name',
					status: report.status
				}
				if (result.changedRows) 
					console.log('Success! /report/check (rid='+report.rid+') '
						+'(status='+report.status+') successfully.');
				else 
					console.log('Success! /report/check (rid='+report.rid+') '
						+'but status doesn\'t change.');
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

//edit the report
exports.edit = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var report = new Object;
	report.uid = operator_uid;
	report.status = 0;
	report.time = new Date((new Date).getTime()-timezone*60*1000);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'report';
	ret.action = 'edit';

	fire.on('check', function(){
		var check = !isNaN(operator_uid) && (token!=undefined) &&
			!isNaN(report.rid) && (req.body.image!=undefined);

		if (check){
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /report/edit without operator_uid, '
				+'token, rid, or image.');

			fire.emit('send');
		}
	});
	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /report/edit auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_level==10) {
				fire.emit('search');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /report/edit '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search', function(){
		connection.query('SELECT * FROM report WHERE rid = '+report.rid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /report/edit (rid='+report.rid+') '
					+'find with database error:', err);
			
				fire.emit('send');
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /report/edit (rid='+report.rid+') '
					+'is not in database.');

				fire.emit('send');
			}
			else {
				report.url = rows[0].url;

				fire.emit('update');
			}
		});
	});
	fire.on('update', function(){
		connection.query('UPDATE report SET ? WHERE rid = '+report.rid, report,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /report/edit (rid='+report.rid+') '
					+'with database error:', err);
			}
			else {
				var filename = path.join(ROOT_PATH, FILE_PREFIX, 
					IMAGE_DIR, report.url);
				fs.writeFile(filename, new Buffer(req.body.image, 'base64'), 
				function(err){
		    		if (err) console.log('Error! /report/edit write image '
						+'with error:', err);
		    	});

				ret.brea = 0;
				if (result.changedRows) 
					console.log('Success! /report/edit (rid='+report.rid+')');
				else 
					console.log('Success! /report/edit (rid='+report.rid+') '
						+'but doesn\'t change.');	
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

//delete a report
exports.delete = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var rid = parseInt(req.body.rid);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'report';
	ret.action = 'delete';

	fire.on('check', function(){
		var check = !isNaN(operator_uid) && 
			(token!=undefined) && !isNaN(rid);

		if (check){
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /report/delete without operator_uid, '
				+'token or rid.');

			fire.emit('send');
		}
	});
	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /report/delete auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('delete');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /report/delete '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('delete', function(){
		connection.query('DELETE FROM report WHERE rid = '+rid,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /report/delete (rid='+rid+') '
					+'with database error:', err);
			}
			else if (result.affectedRows) {
				ret.brea = 0;
				console.log('Success! /report/delete (rid='+rid+') '
					+'successfully.');
			}
			else {
				ret.brea = 3;
				console.log('Failed! /report/delete (rid='+rid+') '
					+'is not in database.');
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

//read the report's information
exports.read = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.query.operator_uid);
	var token = req.query.token;

	var uid = parseInt(req.query.uid);
	var mid = parseInt(req.query.mid);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'report';
	ret.action = 'read';

	fire.on('check', function(){
		var check = !isNaN(operator_uid) && (token!=undefined);
		var read_which = !isNaN(uid)+!isNaN(mid);
		check = check && (read_which==1); 

		if (check){
			fire.emit('auth');
		}
		else {
			ret.brea = 2;
			console.log('Failed! /report/read without operator_uid, '
				+'token, mid or uid.');

			fire.emit('send');
		}
	});
	fire.on('auth', function(){
		

		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /report/read auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token) {
				if (rows[0].auth_level>10 && !isNaN(mid)){
					fire.emit('search_mid');
				}
				else if (rows[0].auth_level==10 && !isNaN(uid)){
					fire.emit('search_uid');
				}
				else {
					ret.brea = 4;
					console.log('Failed! /report/read (operator_uid='
						+operator_uid+') auth and attribute not match.');

					fire.emit('send');
				}
			}
			else {
				ret.brea = 4;
				console.log('Failed! /report/read '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search_uid', function(){
		connection.query('SELECT * FROM report WHERE uid = '+uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /report/read (uid='+uid+') '
					+'with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /report/read (uid='+uid+') '
					+'cannot find in database.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				}
				console.log('Success! /report/read (uid='+uid+') '
					+'successfully.');
			}

			fire.emit('send');
		});
	});
	fire.on('search_mid', function(){
		connection.query('SELECT * FROM report WHERE mid = '+mid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /report/read (mid='+mid+') '
					+'with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /report/read (mid='+mid+') '
					+'cannot find in database.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				}
				console.log('Success! /report/read (mid='+mid+') '
					+'successfully.');
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
