var events = require('events');
var path = require('path');
var crypto = require('crypto');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require(path.join(ROOT_PATH, 'src/db.js'));
var connection = db.conn();

const timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//create a new mission
exports.create = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;
	var rand_name = crypto.randomBytes(5).toString('hex');
	
	var mission = new Object;

	mission.title = req.body.title;
	mission.content = req.body.content;
	mission.time_start = req.body.time_start;
	mission.time_end = req.body.time_end;
	mission.prize = parseInt(req.body.prize);
	mission.clue = req.body.clue;
	mission.class = req.body.class;
	mission.score = parseInt(req.body.score);
	mission.location_e = parseFloat(req.body.location_e);
	mission.location_n = parseFloat(req.body.location_n);
	if (!isNaN(req.body.image) && (req.body.image !== undefined)){
		mission.time = new Date((new Date).getTime()-timezone*60*1000);
		mission.url = 'mission-'+rand_name+'-'+mission.time.getTime()+'.jpg';
	} 
	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'mission';
	ret.action = 'create';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /mission/create auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (rows.length == 0) {
                ret.brea = 3;
                console.log('Failed! /mission/create (operator_uid:'
                            +operator_uid+') not in database');

                fire.emit('send');
            }
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('create');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /mission/create '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('create', function(){
		connection.query('INSERT INTO mission SET ?', mission,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /mission/create with database error:', err);
			}
			else {
				if (mission.url !== undefined && !isNaN(mission.url)){
					var filename = path.join(ROOT_PATH, FILE_PREFIX,
						IMAGE_DIR, mission.url);
					fs.writeFile(filename, new Buffer(req.body.image, 'base64'), 
						function(err){
			    		if (err) 
			    			console.log('Error! /mission/create write image '
			    				+'with error:', err);
			    	});
			    }
				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					mid : result.insertId
				}
				console.log('Success! /mission/create '
					+'(mid='+result.insertId+') successfully.');
			}
			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	var check = !isNaN(operator_uid) && (token!=undefined);
	for (var key in mission) {
		//no matter if there is location
		if (key!='location_n' || key!='location_e'){
			//if not undefined and not NaN
			var valid = !(isNaN(mission[key]) && (mission[key]==undefined));
			check = check && valid;
		}
	}

	if (check){
		fire.emit('auth');
	}
	else {
		ret.brea = 2;
		console.log('Failed! /mission/create without operator_uid, '
			+'token or some values in object.');

		fire.emit('send');
	}
}

//edit mission content
exports.edit = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var mission = new Object;
	mission.mid = parseInt(req.body.mid);
	mission.title = req.body.title;
	mission.content = req.body.content;
	mission.time_start = req.body.time_start;
	mission.time_end = req.body.time_end;
	mission.prize = parseInt(req.body.prize);
	mission.clue = req.body.clue;
	mission.class = req.body.class;
	mission.score = parseInt(req.body.score);
	mission.location_e = parseFloat(req.body.location_e);
	mission.location_n = parseFloat(req.body.location_n);
	if (!isNaN(req.body.image) && (req.body.image !== undefined)){
		mission.time = new Date((new Date).getTime()-timezone*60*1000);
		mission.url = 'mission-'+rand_name+'-'+mission.time.getTime()+'.jpg';
	} 
	//delete the key that don't send
	for (var key in mission) {
		var invalid = isNaN(mission[key]) || (mission[key]==undefined);
		if (invalid) delete mission[key];
	}

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'mission';
	ret.action = 'edit';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /mission/edit auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (rows.length == 0) {
                ret.brea = 3;
                console.log('Failed! /mission/edit (operator_uid:'
                            +operator_uid+') not in database');

                fire.emit('send');
            }
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('search');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /mission/edit '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search', function(){
		connection.query('SELECT * FROM mission WHERE mid = '+mission.mid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /mission/edit (mid='+mission.mid+') '
					+'find with database error:', err);

				fire.emit('send');
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /mission/edit (mid='+mission.mid+') '
					+'is not in database.');

				fire.emit('send');
			}
			else {
				fire.emit('update');
			}
		});
	});
	fire.on('update', function(){
		connection.query('UPDATE mission SET ? WHERE mid = '+mission.mid, mission,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /mission/edit (mid='+mission.mid+') '
					+'with database error:', err);
			}
			else {
				if (mission.url !== undefined && !isNaN(mission.url)){
					var filename = path.join(ROOT_PATH, FILE_PREFIX,
						IMAGE_DIR, mission.url);
					fs.writeFile(filename, new Buffer(req.body.image, 'base64'), 
						function(err){
			    		if (err) 
			    			console.log('Error! /mission/edit write image '
			    				+'with error:', err);
			    	});
			    }
				ret.brea = 0;
				if (result.changedRows) 
					console.log('Success! /mission/edit (mid='+mission.mid+') '
						+'successfully.');
				else 
					console.log('Success! /mission/edit (mid='+mission.mid+') '
						+'doesn\'t change.');
			}

			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	var check = !isNaN(operator_uid) && (token!=undefined) && 
				!isNaN(mission.mid);

	if (check) {
		fire.emit('auth');
	}
	else {
		ret.brea = 2;
		console.log('Failed! /mission/edit without operator_uid, '
			+'token or mid.');

		fire.emit('send');
	}
}

//delete mission
exports.delete = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.body.operator_uid);
	var token = req.body.token;

	var mid = parseInt(req.body.mid);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'mission';
	ret.action = 'delete';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /mission/delete auth with db error: ',
					err);
				
				fire.emit('send');
			}
			else if (rows.length == 0) {
                ret.brea = 3;
                console.log('Failed! /mission/delete (operator_uid:'
                            +operator_uid+') not in database');

                fire.emit('send');
            }
			else if (token==rows[0].token && rows[0].auth_level>10) {
				fire.emit('delete');
			}
			else {
				ret.brea = 4;
				console.log('Failed! /mission/delete '
					+'(operator_uid='+operator_uid+') auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('delete', function(){
		connection.query('DELETE FROM mission WHERE mid = '+mid,
		function(err, result){
			if (err){
				ret.brea = 1;
				console.log('Failed! /mission/delete (mid='+mid+') '
					+'with database error:', err);
			}
			else if (result.affectedRows) {
				ret.brea = 0;
				console.log('Success! /mission/delete (mid='+mid+') '
					+'successfully.');
			}
			else {
				ret.brea = 3;
				console.log('Failed! /mission/delete (mid='+mid+') '
					+'is not in database.');
			}

			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	var check = !isNaN(operator_uid) && (token!=undefined) && !isNaN(mid);

	if (check) {
		fire.emit('auth');
	}
	else {
		ret.brea = 2;
		console.log('Failed! /mission/delete without operator_uid, '
			+'token or mid.');

		fire.emit('send');
	}
}

//get missions' information
exports.read = function(req, res){
	var fire = new events.EventEmitter;

	var operator_uid = parseInt(req.query.operator_uid);
	var token = req.query.token;

	var mid = parseInt(req.query.mid);

	var ret = new Object;
	ret.uid = operator_uid;
	ret.object = 'mission';
	ret.action = 'read';

	fire.on('auth', function(){
		connection.query('SELECT * FROM auth WHERE uid = '+operator_uid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /mission/read auth with db error: ', err);
				
				fire.emit('send');
			}
			else if (rows.length == 0) {
                ret.brea = 3;
                console.log('Failed! /mission/create (operator_uid:'
                            +operator_uid+') not in database');

                fire.emit('send');
            }
			else if ((token==rows[0].token) && (rows[0].auth_level>=10)) {
				if (!isNaN(mid)) {
					fire.emit('search_mid');
				}
				else if (rows[0].auth_level>10) {
					fire.emit('search');
				}
				else {
					fire.emit('search_time');
				}
			}
			else {
				ret.brea = 4;
				console.log('Failed! /mission/read (uid='+operator_uid+') '
					+'auth failed.');
				
				fire.emit('send');
			}
		});
	});
	fire.on('search_mid', function(){
		connection.query('SELECT * FROM mission WHERE mid = '+mid,
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /mission/read (mid='+mid+') '
					+'with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /mission/read (mid='+mid+') '
					+'is not in database.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				}
				console.log('Success! /mission/read (mid='+mid+') '
					+'successfully');
			}

			fire.emit('send');
		});
	});
	fire.on('search_time', function(){
		connection.query('SELECT * FROM mission WHERE time_start < NOW()',
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /mission/read with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /mission/read database is still empty.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				}
				console.log('Success! /mission/read successfully');
			}

			fire.emit('send');
		});
	});
	fire.on('search', function(){
		connection.query('SELECT * FROM mission',
		function(err, rows){
			if (err) {
				ret.brea = 1;
				console.log('Failed! /mission/read with database error:', err);
			}
			else if (rows.length == 0) {
				ret.brea = 3;
				console.log('Failed! /mission/read database is still empty.');
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Objects',
					objects : rows
				}
				console.log('Success! /mission/read successfully');
			}

			fire.emit('send');
		});
	});
	fire.on('send', function(){
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
	});

	var check = !isNaN(operator_uid) && (token!=undefined);

	if (check) {
		fire.emit('auth');
	}
	else {
		ret.brea = 2;
		console.log('Failed! /mission/read without operator_uid.');
		
		fire.emit('send');
	}
}

setInterval(function(){
	connection.query('SELECT * FROM mission WHERE 1', function(err){
		if (err) {
			console.log('Query mission database error:', err);
		}
	});
}, 10000);
