var path = require('path');
var events = require('events');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require(path.join(ROOT_PATH, 'src/db.js'));
var connection = db.conn();

const timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//create a new clue
exports.create = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var clue = new Object;
	clue.content = req.body.content;

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'clue';
	ret.action = 'create';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /clue/create auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('create');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /clue/create '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('create', function(){
		connection.query('INSERT INTO clue SET ?', clue,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /clue/create with database error:', err);
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					cid : result.insertId
				};
				console.log('Success! /clue/create (cid='+result.insertId+') '
					+'successfully.');
			}

			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	var check = !isNaN(operator_uid) && (token!=undefined) &&
				(clue.content != undefined);

	if (check) {
		fire.emit('auth');
	}
	else {
		ret.brea = 2; //if no complete clue values
		console.log('Failed! /clue/create without operator_uid, '
			+'token or some values in object.');

		fire.emit('send');
	}
}

//delete a clue
exports.delete = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var cid = parseInt(req.body.cid);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'clue';
	ret.action = 'delete';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /clue/delete auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('delete');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /clue/delete '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('delete', function(){
		connection.query('DELETE FROM clue WHERE cid = '+cid,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /clue/delete (cid='+cid+') '
					+'with database error.');
			}
			else if (result.affectedRows) {
				ret.brea = 0;
				console.log('Success! /clue/delete (cid='+cid+') '
					+'successfully.');
			}
			else {
				ret.brea = 3;
				console.log('Failed! /clue/delete (cid='+cid+') '
					+'is not in database.');
			}
			
			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	var check = !isNaN(operator_uid) && 
		(token!=undefined) && !isNaN(cid);

	if (check) {
		fire.emit('auth');
	}
	else {
		ret.brea = 2;
		console.log('Failed! /clue/delete without operator_uid, token or cid.');

		fire.emit('send');
	}
}

//read clues
exports.read = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.query.operator_uid);
	var token = req.query.token;

	var cid = parseInt(req.query.cid);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'clue';
	ret.action = 'read';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /clue/read auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (token==rows[0].token && rows[0].auth_level>=10) {
				if (!isNaN(cid))
					fire.emit('search_cid');
				else
					fire.emit('search');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /clue/read '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search_cid', function(){
		connection.query('SELECT * FROM clue WHERE cid = '+cid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /clue/read (cid='+cid+') '
					+'with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /clue/read (cid='+cid+') '
					+'is not in database.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				};
				console.log('Success! /clue/read (cid='+cid+') '
					+'successfully.');
			}
			
			fire.emit('send');
		});
	});
	fire.on('search', function(){
		connection.query('SELECT * FROM clue',
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /clue/read with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /clue/read database is still empty.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				};
				console.log('Success! /clue/read successfully.');
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
		console.log('Failed! /clue/read without operator_uid or token.');

		fire.emit('send');
	}
}

setInterval(function(){
	connection.query('SELECT * FROM clue WHERE 1', function(err){
		if (err) {
			console.log('Query clue database error:', err);
		}
	});
}, 10000);