var db = require('./db.js');
var connect = db.conn();

//create a new clue
exports.create = function(req, res){
	content = req.body.content;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "clue";
	ret.action = "create";

	if (content) {
		connect.query("INSERT INTO clue SET ?", clue, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				console.log("create clue successfully");
			}
		});
		connect.query("SELECT cid FROM clue WHERE content = "+content, function(err, rows){
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
						cid : info.cid
					}
					res.json(ret);
					console.log("get clue id successfully");
				}
			}
		});
	}
	else {
		ret.brea = 2; //if no complete clue values
		res.json(ret);
		console.log("uncomplete clue values");
	}
}

//delete a clue
exports.delete = function(req, res){
	var cid = req.body.cid;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "clue";
	ret.action = "delete";

	if (cid) {
		connect.query("DELETE FROM clue WHERE cid = "+cid, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				res.json(ret);
				console.log("delete clue successfully");
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("no cid value")
	}
}

//read clues
exports.read = function(req, res){
	var cid = req.body.cid;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "clue";
	ret.action = "read";

	if (cid) {
		connect.query("SELECT * FROM clue WHERE cid = "+cid, function(err, rows){
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
		connect.query("SELECT * FROM clue", function(err, rows){
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
