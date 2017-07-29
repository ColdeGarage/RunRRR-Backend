var fs = require('fs');
var events = require('events');
var crypto = require('crypto');
var path = require('path');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require(path.join(ROOT_PATH, 'src/db.js'));
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

//create a new tool
exports.create = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

    var rand_name = crypto.randomBytes(5).toString('hex');

	var tool = new Object;
	tool.title = req.body.title;
	tool.content = req.body.content;
	tool.url = 'tool-'+rand_name+'.jpg';
	tool.expire = parseInt(req.body.expire);
	tool.price = parseInt(req.body.price);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'tool';
	ret.action = 'create';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /tool/create auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (rows.length == 0) {
                ret.brea = 3;
                console.log('Failed! /tool/create (operator_uid:'
                            +operator_uid+') not in database');

                fire.emit('send');
            }
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('create');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /tool/create '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('create', function(){
		connection.query('INSERT INTO tool SET ?', tool,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /tool/create with database error:', err);
			}
			else {
				var filename = path.join(ROOT_PATH, FILE_PREFIX,
					IMAGE_DIR, tool.url);
				fs.writeFile(filename, new Buffer(req.body.image, 'base64'),
				function(err){
		    		if (err) {
		    			console.log('Error! /tool/create write image '
							+'with error:', err);
		    		}
		    	});

				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					tid : result.insertId
				};
				console.log('Success! /tool/create (tid='+result.insertId+') '
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
				(req.body.image!=undefined);
	for (var key in tool) {
		var valid = !(isNaN(tool[key]) && (tool[key]==undefined));
		check = check && valid;
	}

	if (check) {
		fire.emit('auth');
	}
	else {
		ret.brea = 2; //if no complete tool values
		console.log('Failed! /tool/create without operator_uid '
			+'token or some values in object.');

		fire.emit('send');
	}
}

//delete a tool
exports.delete = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var tid = parseInt(req.body.tid);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'tool';
	ret.action = 'delete';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /tool/delete auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (rows.length == 0) {
                ret.brea = 3;
                console.log('Failed! /tool/delete (operator_uid:'
                            +operator_uid+') not in database');

                fire.emit('send');
            }
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('delete');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /tool/delete '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('delete', function(){
		connection.query('DELETE FROM tool WHERE tid = '+tid,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /tool/delete (tid='+tid+') '
					+'with database error:', err);
			}
			else if (result.affectedRows) {
				ret.brea = 0;
				console.log('Success! /tool/delete (tid='+tid+') '
					+'successfully.');
			}
			else {
				ret.brea = 3;
				console.log('Failed! /tool/delete (tid='+tid+') '
					+'is not in database.');
			}
			
			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	var check = !isNaN(operator_uid) && (token!=undefined) && !isNaN(tid);

	if (check) {
		fire.emit('auth');
	}
	else {
		ret.brea = 2;
		console.log('Failed! /tool/delete without operator_uid, token or tid.');

		fire.emit('send');
	}
}

//read tools
exports.read = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.query.operator_uid);
	var token = req.query.token;

	var tid = parseInt(req.query.tid);

	var ret = new Object;
	ret.uid = parseInt(req.query.operator_uid);
	ret.object = 'tool';
	ret.action = 'read';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /tool/read auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (rows.length == 0) {
                ret.brea = 3;
                console.log('Failed! /tool/read (operator_uid:'
                            +operator_uid+') not in database');

                fire.emit('send');
            }
			else if (token==rows[0].token && rows[0].auth_level>=10) {
				if (!isNaN(tid)) {
					fire.emit('search_tid');
				}
				else {
					fire.emit('search');
				}
			}
			else {
				ret.brea = 4;
				console.log('Failed! /tool/read '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search_tid', function(){
		connection.query('SELECT * FROM tool WHERE tid = '+tid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /tool/read (tid='+tid+') '
					+'with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /tool/read (tid='+tid+') '
					+'is not in database.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				};
				console.log('Success! /tool/read (tid='+tid+') '
					+'successfully.');
			}

			fire.emit('send');
		});
	});
	fire.on('search', function(){
		connection.query('SELECT * FROM tool', function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /tool/read with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /tool/read database is still empty.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				};
				console.log('Success! /tool/read successfully.');
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
		console.log('Failed! /tool/read without operator_uid or token.');

		fire.emit('send');
	}
}

setInterval(function(){
	connection.query('SELECT * FROM tool WHERE 1', function(err){
		if (err) {
			console.log('Query tool database error:', err);
		}
	});
}, 10000);