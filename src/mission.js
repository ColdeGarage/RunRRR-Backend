var db = require("./db.js");
var connect = db.conn();

//create a new mission
exports.create = function(req, res){
	var mission = new Object;
	mission.title = req.body.title;
	mission.content = req.body.content;
	mission.time_start = req.body.time_start;
	mission.time_end = req.body.time_end;
	mission.prize = req.body.prize;
	mission.clue = req.body.clue;
	mission.class = req.body.class;
	mission.score = req.body.score;

	//check if post all of the values
	var check = 1;
	for (var key in mission) {
		check = check && (mission[key]!=null);
	}
	
	mission.location_e = req.body.location_e;
	mission.location_n = req.body.location_n;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "mission";
	ret.action = "create";

	check = check && (ret.uid!=null);
	if (check) {
		connect.query("INSERT INTO mission SET ?", mission, function(err, result){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Mission create with database error.");
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : "Attribute Name",
					mid : result.insertId
				}
				console.log("Success! Mission create successfully.");
			}
		});
	}
	else {
		ret.brea = 2; //if no complete mission values
		res.json(ret);
		console.log("Failed! Mission create with uncomplete values.");
	}
}

//edit mission content
exports.edit = function(req, res){
	var mission = new Object;
	mission.mid = req.body.mid;
	mission.title = req.body.title;
	mission.content = req.body.content;
	mission.time_start = req.body.time_start;
	mission.time_end = req.body.time_end;
	mission.price = req.body.price;
	mission.clue = req.body.clue;
	mission.class = req.body.class;
	mission.score = req.body.score;
	mission.location_e = req.body.location_e;
	mission.location_n = req.body.location_n;

	//delete the key that don't send
	for (var key in mission) {
		if (!mission[key]) {
			delete mission[key];
		}
	}

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "mission";
	ret.action = "edit";

	var check = (ret.uid!=null) && (mission.mid!=null);
	if (check) {
		connect.query("UPDATE mission SET ? WHERE mid = "+mission.mid, mission, function(err, result){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Mission edit with database error.");
			}
			else {
				if (result.changeRows) {
					ret.brea = 0;
					res.json(ret);
					console.log("Success! Mission edit successfully");
				}
				else {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! Mission database has nothing to edit.");
				}
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Mission edit without operator_uid or mid.");
	}
}

//delete mission
exports.delete = function(req, res){
	var mid = req.body.mid;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "mission";
	ret.action = "delete";

	var check = (ret.uid!=null) && (mid!=null);
	if (check) {
		connect.query("DELETE FROM mission WHERE mid = "+mid, function(err, result){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("Failed! Mission delete with database error.");
			}
			else {
				if (result.affectedRows) {
					ret.brea = 0;
					res.json(ret);
					console.log("Success! Mission delete successfully.");
				}
				else {
					ret.brea = 3;
					res.json(ret);
					console.log("Failed! Mission database has nothing to delete.");
				}
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Mission delete without operator_uid or mid.");
	}
}

//get missions" information
exports.read = function(req, res){
	var mid = req.query.mid;

	var ret = new Object;
	ret.uid = req.query.operator_uid;
	ret.object = "mission";
	ret.action = "read";

	if (ret.uid!=null) {
		if (mid!=null) {
			connect.query("SELECT * FROM mission WHERE mid = "+mid, function(err, rows){
				if (err) {
					ret.brea = 1;
					res.json(ret);
					console.log("Failed! (mid) Mission read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						res.json(ret);
						console.log("Failed! (mid) Mission database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "objects",
							objects : rows
						}
						res.json(ret);
						console.log("Success! (mid) Mission read successfully");
					}
				} 
			});
		}
		else {
			connect.query("SELECT * FROM mission", function(err, rows){
				if (err) {
					ret.brea = 1;
					res.json(ret);
					console.log("Failed! Mission read with database error.");
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						res.json(ret);
						console.log("Failed! Mission database is still empty.");
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : "objects",
							objects : rows
						}
						res.json(ret);
						console.log("Success! Mission read successfully");
					}	
				}
			});
		}
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("Failed! Mission read without operator_uid.");
	}
}