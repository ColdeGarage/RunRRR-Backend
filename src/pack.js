var db = require('./db.js');
var connection = db.conn();

var timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//create a backpack
exports.create = function(req, res){
	var pack = new Object;
	pack.uid = parseInt(req.body.uid);
	pack.class = req.body.class;
	pack.id = parseInt(req.body.id);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = "pack";
	ret.action = "create";

	//check if post all of the values
	var check = 1;
	for (var key in pack) {
		var valid = !(isNaN(pack[key]) && (pack[key]==undefined))
		check = check && valid;
	}
	check = check && !isNaN(ret.uid);
	if (check) {
		connection.query("INSERT INTO pack SET ?", pack, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log("Failed! Pack create with database error.");
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : "Attribute Name",
					pid : result.insertId
				}
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log("Success! Pack create successfully.");
			}
		});
	}
	else {
		ret.brea = 2; //if no complete pack values
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log("Failed! Pack create with uncomplete values.");
	}
}

//delete a backpack
exports.delete = function(req, res){
	var pid = parseInt(req.body.pid);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = "pack";
	ret.action = "delete";

	var check = !isNaN(ret.uid) && !isNaN(pid);
	if (check) {
		connection.query("DELETE FROM pack WHERE pid = "+pid, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log("Failed! Pack delete with database error.");
			}
			else {
				if (result.affectedRows) {
					ret.brea = 0;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log("Success! Pack delete successfully.");
				}
				else {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log("Failed! Pack database has nothing to delete.");
				}
			}
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log("Failed! Pack delete without operator_uid or pid.");
	}
}

//read the backpack's information
exports.read = function(req, res){
	var pid = parseInt(req.query.pid);

	var ret = new Object;
	ret.uid = parseInt(req.query.operator_uid);
	ret.object = "pack";
	ret.action = "read";

	if (!isNaN(ret.uid)) {
		if (!isNaN(pid)) {
			connection.query("SELECT * FROM pack WHERE pid = "+pid, function(err, rows){
				if (err) {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log("Failed! (pid) Pack read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 1;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log("Failed! (pid) Pack database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "Objects",
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log("Success! Pack read successfully.");
					}
				} 
			});
		}
		else {
			connection.query("SELECT * FROM pack", function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log("Failed! Pack read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log("Failed! Pack database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "Objects",
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log("Success! Pack read successfully.");
					}	
				}
			});
		}
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log("Failed! Pack read without operator_uid.");
	}
}
