var db = require('./db.js');
var connect = db.conn();

//create a backpack
exports.create = function(req, res){
	var pack = new Object;
	pack.uid = req.body.uid;
	pack.class = req.body.class;
	pack.id = req.body.id;

	//check if post all of the values
	var check = 1;
	for (var key in pack) {
		check = check && pack[key];
	}

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "pack";
	ret.action = "create";

	if (check) {
		connect.query("INSERT INTO pack SET ?", pack, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				console.log("create pack successfully");
			}
		});
		connect.query("SELECT pid FROM pack WHERE uid = "+pack.uid, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				if (rows.length == 0) {
					ret.brea = 1;
					res.json(ret);
					console.log("empty db");
				}
				else {
					ret.brea = 0;
					var info = JSON.parse(rows);
					ret.payload = {
						type : "Attribute Name",
						pid : info.pid
					}
					res.json(ret);
					console.log("get pack id successfully");
				}
			}
		});
	}
	else {
		ret.brea = 2; //if no complete pack values
		res.json(ret);
		console.log("uncomplete pack values");
	}
}

//delete a backpack
exports.delete = function(req, res){
	var pid = req.body.pid;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "pack";
	ret.action = "delete";

	if (pid) {
		connect.query("DELETE FROM pack WHERE pid = "+pid, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				res.json(ret);
				console.log("delete pack successfully");
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("no pid value")
	}
}

//read the backpack's information
exports.read = function(req, res){
	var pid = req.query.pid;

	var ret = new Object;
	ret.uid = req.query.operator_uid;
	ret.object = "pack";
	ret.action = "read";

	if (pid) {
		connect.query("SELECT * FROM pack WHERE pid = "+pid, function(err, rows){
			if (err) {
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				if (rows.length == 0) {
					ret.brea = 1;
					res.json(ret);
					console.log("empty db");
				}
				else {
					ret.brea = 0;
					var info = JSON.parse(rows);
					ret.payload = {
						type : "objects",
						objects : info
					}
					res.json(ret);
					console.log("read successfully");
				}
			} 
		});
	}
	else {
		connect.query("SELECT * FROM pack", function(err, rows){
			if (err) {
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				if (rows.length == 0) {
					ret.brea = 1;
					res.json(ret);
					console.log("empty db");
				}
				else {
					ret.brea = 0;
					var info = JSON.parse(rows);
					ret.payload = {
						type : "objects",
						objects : info
					}
					res.json(ret);
					console.log("read successfully");
				}	
			}
		});
	}
}
