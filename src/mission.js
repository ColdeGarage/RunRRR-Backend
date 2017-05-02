var path = require('path');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require(path.join(ROOT_PATH, 'src/db.js'));
var connection = db.conn();

var timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//create a new mission
exports.create = function(req, res){
	var mission = new Object;
	mission.title = req.body.title;
	mission.content = req.body.content;
	mission.time_start = req.body.time_start;
	mission.time_end = req.body.time_end;
	mission.prize = parseInt(req.body.prize);
	mission.clue = req.body.clue;
	mission.class = req.body.class;
	mission.score = parseInt(req.body.score);

	//check if post all of the values
	var check = 1;
	for (var key in mission) {
		//if not undefined and not NaN
		var valid = !(isNaN(mission[key]) && (mission[key]==undefined))
		check = check && valid;
	}
	
	mission.location_e = parseFloat(req.body.location_e);
	mission.location_n = parseFloat(req.body.location_n);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'mission';
	ret.action = 'create';

	check = check && !isNaN(ret.uid);
	if (check) {
		connection.query('INSERT INTO mission SET ?', mission, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /mission/create with database error:', err);
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					mid : result.insertId
				}
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Success! /mission/create (mid='+result.insertId+') successfully.');
			}
		});
	}
	else {
		ret.brea = 2; //if no complete mission values
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /mission/create without operator_uid or some values in object.');
	}
}

//edit mission content
exports.edit = function(req, res){
	var mission = new Object;
	mission.mid = parseInt(req.body.mid);
	mission.title = req.body.title;
	mission.content = req.body.content;
	mission.time_start = req.body.time_start;
	mission.time_end = req.body.time_end;
	mission.prize = parseInt(req.body.prize);
	mission.clue = req.body.clue;
	mission.class = req.body.class;
	mission.score = parseInt(req.body.score);
	mission.location_e = parseFloat(req.body.location_e);
	mission.location_n = parseFloat(req.body.location_n);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'mission';
	ret.action = 'edit';

	var check = !isNaN(ret.uid) && !isNaN(mission.mid);
	//delete the key that don't send
	for (var key in mission) {
		//if not undefined and not NaN
		var invalid = isNaN(mission[key]) || (mission[key]==undefined)
		if (invalid) delete mission[key];
	}
	if (check) {
		connection.query('SELECT * FROM mission WHERE mid = '+mission.mid, function(err, rows){
			if (err) {
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /mission/edit (mid='+mission.mid+') find with database error:', err);
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /mission/edit (mid='+mission.mid+') is not in database.');
				}
				else {
					connection.query('UPDATE mission SET ? WHERE mid = '+mission.mid, mission, function(err, result){
						if (err){
							ret.brea = 1;
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							console.log('Failed! /mission/edit (mid='+mission.mid+') with database error:', err);
						}
						else {
							ret.brea = 0;
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							if (result.changedRows) 
								console.log('Success! /mission/edit (mid='+mission.mid+') successfully.');
							else 
								console.log('Success! /mission/edit (mid='+mission.mid+') doesn\'t change.');
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
		console.log('Failed! /mission/edit without operator_uid or mid.');
	}
}

//delete mission
exports.delete = function(req, res){
	var mid = parseInt(req.body.mid);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'mission';
	ret.action = 'delete';

	var check = !isNaN(ret.uid) && !isNaN(mid);
	if (check) {
		connection.query('DELETE FROM mission WHERE mid = '+mid, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /mission/delete (mid='+mid+') with database error:', err);
			}
			else {
				if (result.affectedRows) {
					ret.brea = 0;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Success! /mission/delete (mid='+mid+') successfully.');
				}
				else {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /mission/delete (mid='+mid+') is not in database.');
				}
			}
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /mission/delete without operator_uid or mid.');
	}
}

//get missions' information
exports.read = function(req, res){
	var mid = parseInt(req.query.mid);

	var ret = new Object;
	ret.uid = parseInt(req.query.operator_uid);
	ret.object = 'mission';
	ret.action = 'read';

	if (!isNaN(ret.uid)) {
		if (!isNaN(mid)) {
			connection.query('SELECT * FROM mission WHERE mid = '+mid, function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /mission/read (mid='+mid+') with database error:', err);
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Failed! /mission/read (mid='+mid+') is not in database.');
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : 'Objects',
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Success! /mission/read (mid='+mid+') successfully');
					}
				} 
			});
		}
		else {
			connection.query('SELECT * FROM mission', function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /mission/read with database error:', err);
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Failed! /mission/read database is still empty.');
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : 'Objects',
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Success! /mission/read successfully');
					}	
				}
			});
		}
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /mission/read without operator_uid.');
	}
}