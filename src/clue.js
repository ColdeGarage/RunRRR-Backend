var db = require('./db.js');
var connect = db.conn();

//create a new clue
exports.create = function(req, res){
	var clue = new Object;
	clue.content = req.body.content;

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = "clue";
	ret.action = "create";

	var check = !isNaN(ret.uid) && (clue.content != undefined);
	if (check) {
		connect.query("INSERT INTO clue SET ?", clue, function(err, result){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Clue create with database error.");
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : "Attribute Name",
					cid : result.insertId
				}
				res.json(ret);
				console.log("Success! Clue create successfully.");
			}
		});
	}
	else {
		ret.brea = 2; //if no complete clue values
		res.json(ret);
		console.log("Failed! Clue create with uncomplete values.");
	}
}

//delete a clue
exports.delete = function(req, res){
	var cid = parseInt(req.body.cid);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = "clue";
	ret.action = "delete";

	var check = !isNaN(ret.uid) && !isNaN(cid);
	if (check) {
		connect.query("DELETE FROM clue WHERE cid = "+cid, function(err, result){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Clue delete with database error.");
			}
			else {
				if (result.affectedRows) {
					ret.brea = 0;
					res.json(ret);
					console.log("Success! Clue delete successfully.");
				}
				else {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! Clue database has nothing to delete.");
				}
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Clue delete without operator_uid or cid.");
	}
}

//read clues
exports.read = function(req, res){
	var cid = parseInt(req.query.cid);

	var ret = new Object;
	ret.uid = parseInt(req.query.operator_uid);
	ret.object = "clue";
	ret.action = "read";

	if (!isNaN(ret.uid)) {
		if (!isNaN(cid)) {
			connect.query("SELECT * FROM clue WHERE cid = "+cid, function(err, rows){
				if (err) {
					ret.brea = 1;
					res.json(ret);
					console.log("Failed! (cid) Clue read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						res.json(ret);
						console.log("Failed! (cid) Clue database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "objects",
							objects : rows
						}
						res.json(ret);
						console.log("Success! (cid) Clue read successfully.");
					}
				} 
			});
		}
		else {
			connect.query("SELECT * FROM clue", function(err, rows){
				if (err) {
					ret.brea = 1;
					res.json(ret);
					console.log("Failed! Clue read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						res.json(ret);
						console.log("Failed! Clue database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "objects",
							objects : rows
						}
						res.json(ret);
						console.log("Success! Clue read successfully.");
					}	
				}
			});
		}
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Clue read without operator_uid.")
	}
}
