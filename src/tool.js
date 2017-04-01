var db = require('./db.js');
var connect = db.conn();

//create a new tool
exports.create = function(req, res){
	var tool = new Object;
	tool.title = req.body.title;
	tool.content = req.body.content;
	tool.url = req.body.url;
	tool.expire = req.body.expire;
	tool.price = req.body.price;

	//check if post all of the values
	var check = 1;
	for (var key in tool) {
		check = check && tool[key];
	}

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "tool";
	ret.action = "create";

	if (check) {
		connect.query("INSERT INTO tool SET ?", tool, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				console.log("create tool successfully");
			}
		});
		connect.query("SELECT tid FROM tool WHERE title = "+tool.title, function(err, rows){
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
						tid : info.tid
					}
					res.json(ret);
					console.log("get tool id successfully");
				}
			}
		});
	}
	else {
		ret.brea = 2; //if no complete tool values
		res.json(ret);
		console.log("uncomplete tool values");
	}
}

//delete a tool
exports.delete = function(req, res){
	var tid = req.body.tid;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "tool";
	ret.action = "delete";

	if (tid) {
		connect.query("DELETE FROM tool WHERE tid = "+tid, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				res.json(ret);
				console.log("delete tool successfully");
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("no tid value")
	}
}

//read tools
exports.read = function(req, res){
	var tid = req.body.tid;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "tool";
	ret.action = "read";

	if (tid) {
		connect.query("SELECT * FROM tool WHERE tid = "+tid, function(err, rows){
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
		connect.query("SELECT * FROM tool", function(err, rows){
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
