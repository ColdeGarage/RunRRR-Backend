var db = require('./db.js');
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
	ret.object = "tool";
	ret.action = "create";

	//check if post all of the values
	var check = 1;
	for (var key in tool) {
		var valid = !(isNaN(tool[key]) && (tool[key]==undefined))
		check = check && valid;
	}
	check = check && !isNaN(ret.uid);
	if (check) {
		connection.query("INSERT INTO tool SET ?", tool, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log("Failed! Tool create with database error.");
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : "Attribute Name",
					tid : result.insertId
				}
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log("Success! Tool create successfully.");
			}
		});
	}
	else {
		ret.brea = 2; //if no complete tool values
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log("Failed! Tool create with uncomplete values.");
	}
}

//delete a tool
exports.delete = function(req, res){
	var tid = parseInt(req.body.tid);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = "tool";
	ret.action = "delete";

	var check = !isNaN(ret.uid) && !isNaN(tid);
	if (check) {
		connection.query("DELETE FROM tool WHERE tid = "+tid, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log("Failed! Tool delete with database error.");
			}
			else {
				if (result.affectedRows) {
					ret.brea = 0;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log("Success! Tool delete successfully.");
				}
				else {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log("Failed! Tool database has nothing to delete.");
				}
			}
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log("Failed! Tool delete without operator_uid or tid.");
	}
}

//read tools
exports.read = function(req, res){
	var tid = parseInt(req.query.tid);

	var ret = new Object;
	ret.uid = parseInt(req.query.operator_uid);
	ret.object = "tool";
	ret.action = "read";

	if (!isNaN(ret.uid)) {
		if (!isNaN(tid)) {
			connection.query("SELECT * FROM tool WHERE tid = "+tid, function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log("Failed! (tid) Tool read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log("Failed! (tid) Tool database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "Objects",
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log("Success! (tid) Tool read successfully.");
					}
				} 
			});
		}
		else {
			connection.query("SELECT * FROM tool", function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log("Failed! Tool read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log("Failed! Tool database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "Objects",
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log("Success! Tool read successfully.");
					}	
				}
			});
		}
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log("Failed! Tool read without operator_uid.");
	}
}
