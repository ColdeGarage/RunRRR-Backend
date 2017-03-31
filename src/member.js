var db = require('./db.js');
var request = require('request');
var connect = db.conn();

//return member's status
exports.liveordie = function(req, res){
	var uid = req.body.uid;
	var info = {status : req.body.status};

	var ret = new Object;
	ret.uid = uid;
	ret.object = "member";
	ret.action = "liveordie";

	var check = uid && info.status;
	if (check) {
		connect.query("UPDATE member SET ? WHERE uid = "+uid, info, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : "Attribute Name",
					status : info.status
				};
				res.json(ret);
				console.log("send successfully");
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("uncomplete values");
	}
}

//update member's location
exports.update = function(req, res){
	var member = new Object;
	member.uid = req.body.uid;
	member.position_e = req.body.position_e;
	member.position_n = req.body.position_n;

	var ret = new Object;
	ret.uid = member.uid;
	ret.object = "member";
	ret.action = "update";

	var check = member.uid && member.position_e && member.position_n
	if (check) {
		connect.query("UPDATE member SET ? WHERE uid = "+uid, member, function(err, rows){
			if (err) {
				ret.brea = 1;
				res.json(ret);
				console.log("update error");
			}
			else {
				ret.brea = 0;
				res.json(ret);
				console.log("update successfully");
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("uncomplete values");
	}
}

//return member's information
exports.read = function(req, res){
	var uid = req.query.uid;

	var ret = new Object;
	ret.uid = uid;
	ret.object = "member";
	ret.action = "read";

	if (uid) {
		connect.query("SELECT * FROM member WHERE uid = "+uid, function(err, rows){
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
		connect.query("SELECT * FROM member", function(err, rows){
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
//edit member's money
exports.money = function(req, res){
	var uid = req.body.uid;
	var amount = req.body.money_amount;

	var ret = new Object;
	ret.uid = uid;
	ret.object = "member";
	ret.action = "money";

	var check = uid && amount;
	if (check) {
		connect.query("SELECT money FROM member WHERE uid = "+uid, function(err, rows){
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
					console.log("get money successfully");
				}
			}
		});
		info.money = info.money + amount;
		connect.query("UPDATE member SET ? WHERE uid = "+uid, info, function(err, rows){
			if (err){
				ret.brea = 1;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 0;
				res.json(ret);
				console.log("update money successfully");
			}
		});
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("uncomplete values");
	}
}
//get emergency
exports.callhelp = function(req, res){
	var uid = req.body.uid;
	var position_e = req.body.position_e;
	var position_n = req.body.position_n;

	var ret = new Object;
	ret.uid = uid;
	ret.object = "member";
	ret.action = "callhelp";

	var check = uid && position_e && position_n;
	if (check) {
		ret.brea = 0;
		res.json(ret);
		console.log("Someone needs help!!!");
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("uncomplete values but someone needs help !!!!!")
	}
}

// Login auth
exports.login = function(req, res){
	var email = req.body.email;
	var password = req.body.password;

	var ret = new Object;
	ret.object = "member";
	ret.action = "login";

	var check = email && password;
	if (check) {
		request.get({url:'http://www.ee.nthu.edu.tw/engcamp/api/auth.php?token=nthuee&email='+email+'&id='+password},
			function optionalCallback(err, httpResponse, body) {
				if (err) {
					console.error('Login auth access failed:', err);
					ret.uid = 0;
					ret.brea = 1;
					ret.payload = {
						type : "Attribute Name",
						correct : 1
					}
				}
				else if (httpResponse.statusCode == 200){
					console.log('Login auth access success. User auth success.');
					var data = JSON.parse(body);
					ret.uid = data.rid;
					ret.brea = 0;
					ret.payload = {
						type : "Attribute Name",
						correct : 0
					}
				}
				else{
					console.log('Login auth access success. User auth failed.');
					ret.uid = 0;
					ret.brea = 0;
					ret.payload = {
						type : "Attribute Name",
						correct : 1
					}
				}
				res.json(ret);
			}
		);
	}
	else {
		ret.brea = 2;
		res.json(ret);
		console.log("uncomplete values");
	}
}