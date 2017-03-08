//return login verification
exports.login = function(req, res){
	var email = req.body.email;
	var password = req.body.password;

	var ret = new Object;
	ret.object = "member";
	ret.action = "login";

	query("SELECT * FROM member WHERE email = "+email, function(err, rows){
		if (err){
			ret.brea = 0;
			res.json(ret);
			console.log('db error');
		}
		else {
			ret.brea = 1;
			var info = JSON.parse(rows);
			ret.uid = info['uid'];

			if (password == info['password']) {
				ret.payload = {
					type : correct,
					objects : {correct : 1}
				};
				res.json(ret);
				console.log('check successfully');
			}
			else {
				ret.payload = {
					type : "correct",
					objects : {correct : 0}
				};
				res.json(ret);
				console.log('login error');
			}
		}
	})
}

//return member's status
exports.liveordie = function(req, res){
	var uid = req.body.uid;

	var ret = new Object;
	ret.uid = uid;
	ret.object = "member";
	ret.action = "liveordie";

	db.query("SELECT status FROM member WHERE uid = "+uid, function(err, rows){
		if (err){
			ret.brea = 0;
			res.json(ret);
			console.log('db error');
		}
		else {
			ret.brea = 1;
			var info = JSON.parse(rows);
			ret.payload = {
				type : "status",
				objects : info
			};
			res.json(ret);
			console.log('send successfully');
		}
	})
}

//update member's location
exports.update = function(req, res){
	var member = req.body;

	var ret = new Object;
	ret.uid = uid;
	ret.object = "member";
	ret.action = "update";

	db.query("UPDATE member SET ? WHERE uid = "+uid, member, function(err, rows){
		if (err) {
			ret.brea = 0;
			res.json(ret);
			console.log('update error');
		}
		else {
			ret.brea = 1;
			res.json(ret);
			console.log('update successfully');
		}
	})
}

//return member's information
exports.read = function(req, res){
	var uid = req.query;

	var ret = new Object;
	ret.uid = uid;
	ret.object = "member";
	ret.action = "read";

	if (mid) {
		db.query("SELECT * FROM member", function(err, rows){
			if (err) {
				ret.brea = 0;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 1;
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
		db.query("SELECT * FROM member WHERE uid = ?", uid, function(err, rows){
			if (err) {
				ret.brea = 0;
				res.json(ret);
				console.log("db error");
			}
			else {
				ret.brea = 1;
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
//edit member's money
exports.money = function(req, res){
	var uid = req.body.uid;
	var amount = req.body.money_amount;

	var ret = new Object;
	ret.uid = uid;
	ret.object = "member";
	ret.action = "money";

	db.query("SELECT money FROM member WHERE uid = "+uid, function(err, rows){
		if (err){
			ret.brea = 0;
			res.json(ret);
			console.log('db error');
		}
		else {
			ret.brea = 1;
			var info = JSON.parse(rows);
			console.log('get money successfully');
		}
	})
	info['money'] = info['money'] + amount;
	db.query("UPDATE member SET ? WHERE uid = "+uid, info, function(err, rows){
		if (err){
			ret.brea = 0;
			res.json(ret);
			console.log('db error');
		}
		else {
			ret.brea = 1;
			res.json(ret);
			console.log('update money successfully');
		}
	})
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
	ret.brea = 1;

	res.json(ret);
	console.log("Someone needs help!!!");
}
