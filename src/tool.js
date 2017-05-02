var path = require('path');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require(path.join(ROOT_PATH, 'src/db.js'));
var connection = db.conn();

var timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//create a new tool
exports.create = function(req, res){
	var tool = new Object;
	tool.title = req.body.title;
	tool.content = req.body.content;
	tool.url = req.body.url;
	tool.expire = parseInt(req.body.expire);
	tool.price = parseInt(req.body.price);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'tool';
	ret.action = 'create';

	//check if post all of the values
	var check = 1;
	for (var key in tool) {
		var valid = !(isNaN(tool[key]) && (tool[key]==undefined))
		check = check && valid;
	}
	check = check && !isNaN(ret.uid);
	if (check) {
		connection.query('INSERT INTO tool SET ?', tool, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /tool/create with database error:', err);
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					tid : result.insertId
				}
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Success! /tool/create (tid='+result.insertId+') successfully.');
			}
		});
	}
	else {
		ret.brea = 2; //if no complete tool values
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /toolcreate without operator_uid or some values in object.');
	}
}

//delete a tool
exports.delete = function(req, res){
	var tid = parseInt(req.body.tid);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'tool';
	ret.action = 'delete';

	var check = !isNaN(ret.uid) && !isNaN(tid);
	if (check) {
		connection.query('DELETE FROM tool WHERE tid = '+tid, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /tool/delete (tid='+tid+') with database error:', err);
			}
			else {
				if (result.affectedRows) {
					ret.brea = 0;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Success! /tool/delete (tid='+tid+') successfully.');
				}
				else {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /tool/delete (tid='+tid+') is not in database.');
				}
			}
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /tool/delete without operator_uid or tid.');
	}
}

//read tools
exports.read = function(req, res){
	var tid = parseInt(req.query.tid);

	var ret = new Object;
	ret.uid = parseInt(req.query.operator_uid);
	ret.object = 'tool';
	ret.action = 'read';

	if (!isNaN(ret.uid)) {
		if (!isNaN(tid)) {
			connection.query('SELECT * FROM tool WHERE tid = '+tid, function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /tool/read (tid='+tid+') with database error:', err);
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Failed! /tool/read (tid='+tid+') is not in database.');
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : 'Objects',
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Success! /tool/read (tid='+tid+') successfully.');
					}
				} 
			});
		}
		else {
			connection.query('SELECT * FROM tool', function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /tool/read with database error:', err);
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Failed! /tool/read database is still empty.');
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : 'Objects',
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Success! /tool/read successfully.');
					}	
				}
			});
		}
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /tool/read without operator_uid.');
	}
}
