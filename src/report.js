var fs = require('fs');
var path = require('path');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var db = require('./db.js');
var connection = db.conn();
if (process.env.NODE_ENV === 'production'){
    var config = require(path.join(ROOT_PATH, 'src/config_production.json'));
} else if (process.env.NODE_ENV === 'test') {
    var config = require(path.join(ROOT_PATH, 'src/config_staging.json'));
} else {
    throw 'Environment setting error! Please set NODE_ENV Environment variable';
}

var FILE_PREFIX = config.file_prefix;
var IMAGE_DIR = config.image_dir;
var timezone = (new Date).getTimezoneOffset(); //get timezone(UTC+8) offset

//create a new report
exports.create = function(req, res){
	var report = new Object;
	report.uid = parseInt(req.body.operator_uid);
	report.mid = parseInt(req.body.mid);
	report.url = 'report-m'+report.mid+'-u'+report.uid+'.jpg';
	report.status = 0;
	report.time = new Date((new Date).getTime()-timezone*60*1000);
	
	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'report';
	ret.action = 'create';

	var check = !isNaN(report.uid) && !isNaN(report.mid) && (req.body.image!=undefined);
	if (check) {
    	connection.query('INSERT INTO report SET ?', report, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /report/create (mid='+report.mid+') (uid='+report.uid+') with database error:', err);
			}
			else {
				ret.brea = 0;
				ret.payload = {
					type : 'Attribute Name',
					rid : result.insertId
				}
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Success! /report/create (mid='+report.mid+') (uid='+report.uid+') successfully.');
				var filename = path.join(ROOT_PATH, FILE_PREFIX, IMAGE_DIR, report.url);
				fs.writeFile(filename, new Buffer(req.body.image, 'base64'), 
					function(err){
		    		if (err) console.log('Error! /report/create write image with error:', err);
		    	});
			}
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /report/create without operator_uid, mid, or image.');	
	}
}

//check the report status
exports.check = function(req, res){
	var report = new Object;
	report.rid = parseInt(req.body.rid);
	report.status = parseInt(req.body.status);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'report';
	ret.action = 'check';

	var check = !isNaN(report.rid) && !isNaN(report.status) && !isNaN(ret.uid);
	if (check) {
		connection.query('SELECT * FROM report WHERE rid = '+report.rid, function(err, rows){
			if (err) {
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /report/check (rid='+report.rid+') find rid with database error:', err);
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /report/check (rid='+report.rid+') is not in database.');
				}
				else {
					connection.query('UPDATE report SET ? WHERE rid = '+report.rid, report, function(err, result){
						if (err){
							ret.brea = 1;
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							console.log('Failed! /report/check (rid='+report.rid+') update with database error:', err);
						}
						else {
							ret.brea = 0;
							ret.payload = {
								type: 'Attribute Name',
								status: report.status
							}
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							if (result.changedRows) 
								console.log('Success! /report/check (rid='+report.rid+') (status='+report.status+') successfully.');
							else 
								console.log('Success! /report/check (rid='+report.rid+') but status doesn\'t change.');
						}
					});
				}
			} 
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /report/check without operator_uid, rid, or status.');
	}
}

//edit the report
exports.edit = function(req, res){
	var report = new Object;
	report.rid = parseInt(req.body.rid);
	report.status = 0;
	report.time = new Date((new Date).getTime()-timezone*60*1000);
	
	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'report';
	ret.action = 'edit';

	var check = !isNaN(report.rid) && !isNaN(ret.uid) && (req.body.image!=undefined);
	if (check) {
		connection.query('SELECT * FROM report WHERE rid = '+report.rid, function(err, rows){
			if (err) {
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /report/edit (rid='+report.rid+') find with database error:', err);
			}
			else {
				if (rows.length == 0) {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /report/edit (rid='+report.rid+') is not in database.');
				}
				else {
					report.url = rows[0].url;
					connection.query('UPDATE report SET ? WHERE rid = '+report.rid, report, function(err, result){
						if (err){
							ret.brea = 1;
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							console.log('Failed! /report/edit (rid='+report.rid+') with database error:', err);
						}
						else {
							ret.brea = 0;
							ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
							res.json(ret);
							if (result.changedRows) 
								console.log('Success! /report/edit (rid='+report.rid+')');
							else 
								console.log('Success! /report/edit (rid='+report.rid+') but doesn\'t change.');
							var filename = path.join(ROOT_PATH, FILE_PREFIX, IMAGE_DIR, report.url);
							fs.writeFile(filename, new Buffer(req.body.image, 'base64'), 
								function(err){
					    		if (err) console.log('Error! /report/edit write image with error:', err);
					    	});
						}
					});
				}
			} 
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /report/edit without operator_uid, rid, or image.');
	}
}

//delete a report
exports.delete = function(req, res){
	var rid = parseInt(req.body.rid);

	var ret = new Object;
	ret.uid = parseInt(req.body.operator_uid);
	ret.object = 'report';
	ret.action = 'delete';

	var check = !isNaN(rid) && !isNaN(ret.uid);
	if (check) {
		connection.query('DELETE FROM report WHERE rid = '+rid, function(err, result){
			if (err){
				ret.brea = 1;
				ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
				res.json(ret);
				console.log('Failed! /report/delete (rid='+rid+') with database error:', err);
			}
			else {
				if (result.affectedRows) {
					ret.brea = 0;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Success! /report/delete (rid='+rid+') successfully.');
				}
				else {
					ret.brea = 3;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /report/delete (rid='+rid+') is not in database.');
				}
			}
		});
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /report/delete without operator_uid or rid.');
	}
}

//read the report's information
exports.read = function(req, res){
	var uid = parseInt(req.query.uid);
	var mid = parseInt(req.query.mid);

	var ret = new Object;
	ret.uid = parseInt(req.query.operator_uid);
	ret.object = 'report';
	ret.action = 'read';

	var read_which = !isNaN(uid)+!isNaN(mid);

	if (!isNaN(ret.uid) && (read_which!=2)) {
		if (!isNaN(uid)) {
			connection.query('SELECT * FROM report WHERE uid = '+uid, function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /report/read (uid='+uid+') with database error:', err);
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Failed! /report/read (uid='+uid+') cannot find in database.');
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : 'Objects',
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Success! /report/read (uid='+uid+') successfully.');
					}
				} 
			});
		}
		else if(!isNaN(mid)) {
			connection.query('SELECT * FROM report WHERE mid = '+mid, function(err, rows){
				if (err) {
					ret.brea = 1;
					ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
					res.json(ret);
					console.log('Failed! /report/read (mid='+mid+') with database error:', err);
				}
				else {
					if (rows.length == 0) {
						ret.brea = 3;
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Failed! /report/read (mid='+mid+') cannot find in database.');
					}
					else {
						ret.brea = 0;
						ret.payload = {
							type : 'Objects',
							objects : rows
						}
						ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
						res.json(ret);
						console.log('Success! /report/read (mid='+mid+') successfully.');
					}
				} 
			});
		}
	}
	else {
		ret.brea = 2;
		ret.server_time = new Date((new Date).getTime()-timezone*60*1000);
		res.json(ret);
		console.log('Failed! /report/read without operator_uid, mid, or uid.');
	}
}
