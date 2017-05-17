var path = require('path');
var events = require('events');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require(path.join(ROOT_PATH, 'src/db.js'));
var connection = db.conn();

const timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//create a backpack
exports.create = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var pack = new Object;
	pack.uid = parseInt(req.body.uid);
	pack.class = req.body.class;
	pack.id = parseInt(req.body.id);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'pack';
	ret.action = 'create';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /pack/create auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('create');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /pack/create '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('create', function(){
		connection.query('INSERT INTO pack SET ?', pack,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /pack/create (uid='+pack.uid+') '
					+'with database error:', err);
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					pid : result.insertId
				}
				console.log('Success! /pack/create (uid='+pack.uid+') '
					+'(pid='+result.insertId+').');
			}

			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	var check = !isNaN(operator_uid) && (token!=undefined);
	for (var key in pack) {
		var valid = !(isNaN(pack[key]) && (pack[key]==undefined));
		check = check && valid;
	}

	if(check){
		fire.emit('auth');
	}
	else {
		ret.brea = 2; //if no complete pack values
		console.log('Failed! /pack/create without operator_uid, '
			+'token or some values in object.');

		fire.emit('send');
	}
}

//delete a backpack
exports.delete = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var pid = parseInt(req.body.pid);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'pack';
	ret.action = 'delete';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /pack/delete auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('delete');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /pack/delete '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('delete', function(){
		connection.query('DELETE FROM pack WHERE pid = '+pid,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /pack/delete (pid='+pid+') '
					+'with database error:', err);
			}
			else if (result.affectedRows) {
				ret.brea = 0;
				console.log('Success! /pack/delete (pid='+pid+') '
					+'successfully.');
			}
			else {
				ret.brea = 3;
				console.log('Failed! /pack/delete (pid='+pid+') '
					+'is not in database.');
			}

			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});
	
	var check = !isNaN(operator_uid) && (token!=undefined) && !isNaN(pid);

	if (check) {
		fire.emit('auth');
	}
	else {
		ret.brea = 2;
		console.log('Failed! /pack/delete without operator_uid, '
			+'token or pid.');

		fire.emit('send');
	}
}

//read the backpack's information
exports.read = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.query.operator_uid);
	var token = req.query.token;

	var uid = parseInt(req.query.uid);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'pack';
	ret.action = 'read';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /pack/read auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_level>=10) {
				if (!isNaN(uid))
					fire.emit('search_uid');
				else
					fire.emit('search');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /pack/read '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search_uid', function(){
		connection.query('SELECT * FROM pack WHERE uid = '+uid,
		function(err, rows){
				if (err) {
					ret.brea = 3;
					console.log('Failed! /pack/read (uid='+uid+') '
						+'with database error:', err);
				}
				else if (rows.length == 0) {
					ret.brea = 1;
					console.log('Failed! /pack/read (uid='+uid+') '
						+'is not in database.');
				}
				else {
					ret.brea = 0;
					ret.payload = {
						type : 'Objects',
						objects : rows
					};
					console.log('Success! /pack/read (uid='+uid+') '
						+'successfully.');
				}

				fire.emit('send');
			});
	});
	fire.on('search', function(){
		connection.query('SELECT * FROM pack',
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /pack/read with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /pack/read database is still empty.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				}
				console.log('Success! /pack/read successfully.');
			}	

			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	var check = !isNaN(operator_uid) && (token!=undefined);

	if (check) {
		fire.emit('auth');
	}
	else {
		ret.brea = 2;
		console.log('Failed! /pack/read without operator_uid or token.');

		fire.emit('send');
	}
}

setInterval(function(){
	connection.query('SELECT * FROM pack WHERE 1', function(err){
		if (err) {
			console.log('Query pack database error:', err);
		}
	});
}, 10000);