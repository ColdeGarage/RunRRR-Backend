var db = require("./db.js");
var connect = db.conn();

//create a new mission
exports.create = function(req, res){
	var mission = new Object;
	mission.title = req.body.title;
	mission.content = req.body.content;
	mission.time_start = req.body.time_start;
	mission.time_end = req.body.time_end;
	mission.price = req.body.price;
	mission.clue = req.body.clue;
	mission.class = req.body.class;
	mission.score = req.body.score;
	mission.location = req.body.location;

	//check if post all of the values
	var check = 1;
	for (var key in mission) {
		check = check && mission[key];
	}

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "mission";
	ret.action = "create";

	if (check) {
		connect.query("INSERT INTO mission SET ?", mission, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				console.log("create mission successfully");
			}
		})
		connect.query("SELECT mid FROM mission WHERE title = "+mission.title, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				var info = json.parse(rows);
				ret.payload = {
					type : "Attribute Name",
					mid : info.mid
				}
				res.json(ret);
				console.log("get mission id successfully");
			}
		})
	}
	else {
		ret.brea = 2; //if no complete mission values
		res.json(ret);
		console.log("uncomplete mission values");
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
	mission.location = req.body.location;

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

	connect.query("UPDATE mission SET ? WHERE mid = "+mid, mission, function(err, rows){
		if (err){
			ret.brea = 1;
			res.json(ret);
			console.log("db error");
		}
		else {
			ret.brea = 0;
			res.json(ret);
			console.log("edit mission successfully");
		}
	})
}

//delete mission
exports.delete = function(req, res){
	var mid = req.body.mid;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "mission";
	ret.action = "delete";

	connect.query("DELETE FROM mission WHERE mid = "+mid, function(err, rows){
		if (err){
			ret.brea = 1;
			res.json(ret);
			console.log("db error");
		}
		else {
			ret.brea = 0;
			res.json(ret);
			console.log("delete mission successfully");
		}
	})
}

//get missions" information
exports.read = function(req, res){
	var mid = req.body.mid;

	var ret = new Object;
	ret.uid = req.body.operator_uid;
	ret.object = "mission";
	ret.action = "delete";

	if (uid) {
		connect.query("SELECT * FROM mission WHERE mid = "+mid, function(err, rows){
			if (err) {
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				var info = json.parse(rows);
				ret.payload = {
					type : "objects",
					objects : info
				}
				res.json(ret);
				console.log("read successfully");
			} 
		})
	}
	else {
		connect.query("SELECT * FROM mission", function(err, rows){
			if (err) {
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				var info = json.parse(rows);
				ret.payload = {
					type : "objects",
					objects : info
				}
				res.json(ret);
				console.log("read successfully");
			}
		})
	}
}