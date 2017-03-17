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

	var ret = new Object;
	//ret.uid = uid;
	ret.object = "mission";
	ret.action = "create";

	//check if post all of the values
	var check = 1;
	for (key in mission) {
		check = check && mission[key];
	}

	if (check) {
		connect.query("INSERT INTO mission SET ?", mission, function(err, rows){
			if (err){
				ret.brea = 1;
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
	}
}

//edit mission content
exports.edit = function(req, res){}

//delete mission
exports.edit = function(req, res){}

//get missions" information
exports.edit = function(req, res){}