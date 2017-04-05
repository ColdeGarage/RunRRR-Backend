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
		check = check && (pack[key]!=null);
	}

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "pack";
	ret.action = "create";

	check = check && (ret.uid!=null);
	if (check) {
		connect.query("INSERT INTO pack SET ?", pack, function(err, result){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Pack create with database error.");
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : "Attribute Name",
					pid : result.insertId
				}
				res.json(ret);
				console.log("Success! Pack create successfully.");
			}
		});
	}
	else {
		ret.brea = 2; //if no complete pack values
		res.json(ret);
		console.log("Failed! Pack create with uncomplete values.");
	}
}

//delete a backpack
exports.delete = function(req, res){
	var pid = req.body.pid;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "pack";
	ret.action = "delete";

	var check = (ret.uid!=null) && (pid!=null);
	if (check) {
		connect.query("DELETE FROM pack WHERE pid = "+pid, function(err, result){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Pack delete with database error.");
			}
			else {
				if (result.affectedRows) {
					ret.brea = 0;
					res.json(ret);
					console.log("Success! Pack delete successfully.");
				}
				else {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! Pack database has nothing to delete.");
				}
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Pack delete without operator_uid or pid.");
	}
}

//read the backpack's information
exports.read = function(req, res){
	var pid = req.query.pid;

	var ret = new Object;
	ret.uid = req.query.operator_uid;
	ret.object = "pack";
	ret.action = "read";

	if (ret.uid!=null) {
		if (pid!=null) {
			connect.query("SELECT * FROM pack WHERE pid = "+pid, function(err, rows){
				if (err) {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! (pid) Pack read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 1;
						res.json(ret);
						console.log("Failed! (pid) Pack database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "objects",
							objects : rows
						}
						res.json(ret);
						console.log("Success! Pack read successfully.");
					}
				} 
			});
		}
		else {
			connect.query("SELECT * FROM pack", function(err, rows){
				if (err) {
					ret.brea = 1;
					res.json(ret);
					console.log("Failed! Pack read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						res.json(ret);
						console.log("Failed! Pack database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "objects",
							objects : rows
						}
						res.json(ret);
						console.log("Success! Pack read successfully.");
					}	
				}
			});
		}
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Pack read without operator_uid.");
	}
}
