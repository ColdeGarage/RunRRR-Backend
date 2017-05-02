var path = require('path');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require(path.join(ROOT_PATH, 'src/db.js'));
var connection = db.conn();

var timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//create a new clue
exports.create = function(req, res){
	var clue = new Object;
	clue.content = req.body.content;

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'clue';
	ret.action = 'create';

	var check = !isNaN(ret.uid) && (clue.content != undefined);
	if (check) {
		connection.query('INSERT INTO clue SET ?', clue, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /clue/create with database error:', err);
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					cid : result.insertId
				}
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Success! /clue/create (cid='+result.insertId+') successfully.');
			}
		});
	}
	else {
		ret.brea = 2; //if no complete clue values
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /clue/create without operator_uid or some values in object.');
	}
}

//delete a clue
exports.delete = function(req, res){
	var cid = parseInt(req.body.cid);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'clue';
	ret.action = 'delete';

	var check = !isNaN(ret.uid) && !isNaN(cid);
	if (check) {
		connection.query('DELETE FROM clue WHERE cid = '+cid, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /clue/delete (cid='+cid+') with database error.');
			}
			else {
				if (result.affectedRows) {
					ret.brea = 0;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Success! /clue/delete (cid='+cid+') successfully.');
				}
				else {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /clue/delete (cid='+cid+') is not in database.');
				}
			}
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /clue/delete without operator_uid or cid.');
	}
}

//read clues
exports.read = function(req, res){
	var cid = parseInt(req.query.cid);

	var ret = new Object;
	ret.uid = parseInt(req.query.operator_uid);
	ret.object = 'clue';
	ret.action = 'read';

	if (!isNaN(ret.uid)) {
		if (!isNaN(cid)) {
			connection.query('SELECT * FROM clue WHERE cid = '+cid, function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /clue/read (cid='+cid+') with database error:', err);
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Failed! /clue/read (cid='+cid+') is not in database.');
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : 'Objects',
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Success! /clue/read (cid='+cid+') successfully.');
					}
				} 
			});
		}
		else {
			connection.query('SELECT * FROM clue', function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /clue/read with database error:', err);
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Failed! /clue/read database is still empty.');
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : 'Objects',
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Success! /clue/read successfully.');
					}	
				}
			});
		}
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /clue/read without operator_uid.')
	}
}
