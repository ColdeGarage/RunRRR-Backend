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
		check = check && (tool[key]!=null);
	}

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "tool";
	ret.action = "create";

	if (check) {
		connect.query("INSERT INTO tool SET ?", tool, function(err, result){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Tool create with database error.");
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : "Attribute Name",
					tid : result.insertId
				}
				res.json(ret);
				console.log("Success! Tool create successfully.");
			}
		});
	}
	else {
		ret.brea = 2; //if no complete tool values
		res.json(ret);
		console.log("Failed! Tool create with uncomplete values.");
	}
}

//delete a tool
exports.delete = function(req, res){
	var tid = req.body.tid;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "tool";
	ret.action = "delete";

	if (tid!=null) {
		connect.query("DELETE FROM tool WHERE tid = "+tid, function(err, result){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Tool delete with database error.");
			}
			else {
				if (result.affectedRows) {
					ret.brea = 0;
					res.json(ret);
					console.log("Success! Tool delete successfully.");
				}
				else {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! Tool database has nothing to delete.");
				}
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Tool delete without tid value");
	}
}

//read tools
exports.read = function(req, res){
	var tid = req.query.tid;

	var ret = new Object;
	ret.uid = req.query.operator_uid;
	ret.object = "tool";
	ret.action = "read";

	if (tid!=null) {
		connect.query("SELECT * FROM tool WHERE tid = "+tid, function(err, rows){
			if (err) {
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! (tid) Tool read with database error.");
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! Tool database is still empty.");
				}
				else {
					ret.brea = 0;
					ret.payload = {
						type : "objects",
						objects : rows
					}
					res.json(ret);
					console.log("Success! (tid) Tool read successfully.");
				}
			} 
		});
	}
	else {
		connect.query("SELECT * FROM tool", function(err, rows){
			if (err) {
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Tool read with database error.");
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! Tool database is still empty.");
				}
				else {
					ret.brea = 0;
					ret.payload = {
						type : "objects",
						objects : rows
					}
					res.json(ret);
					console.log("Success! Tool read successfully.");
				}	
			}
		});
	}
}
