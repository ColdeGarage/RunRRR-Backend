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

	console.log("This api is still empty.");
}

//delete a tool
exports.delete = function(req, res){
	console.log("This api is still empty.");
}

//read tools
exports.read = function(req, res){
	console.log("This api is still empty.");
}
