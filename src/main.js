var request = require('request');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var ROOT_PATH = path.resolve(process.env.NODE_PATH);
var member = require(path.join(ROOT_PATH, 'src/member.js'));
var mission = require(path.join(ROOT_PATH, 'src/mission.js'));
var clue = require(path.join(ROOT_PATH, 'src/clue.js'));
var pack = require(path.join(ROOT_PATH, 'src/pack.js'));
var tool = require(path.join(ROOT_PATH, 'src/tool.js'));
var report = require(path.join(ROOT_PATH, 'src/report.js'));
if (process.env.NODE_ENV === 'production'){
    var config = require(path.join(ROOT_PATH, 'src/config_production.json'));
    // create output file for logs
	var util = require('util');
	var output = fs.createWriteStream(path.join(ROOT_PATH, '/server-log/output.log'), {flags:'a'});
	console.log = function(){
	    output.write(util.format.apply(null, arguments)+'\n');
	}
	console.error = console.log;
} else if (process.env.NODE_ENV === 'test') {
    var config = require(path.join(ROOT_PATH, 'src/config_staging.json'));
} else {
    throw 'Environment setting error! Please set NODE_ENV Environment variable';
}

if (process.env.TOKEN===undefined) {
	throw 'Environment setting error! Please set NODE_ENV Environment variable';
}

const PORT = config.port;
const HOST = config.host;
const HOST_PREFIX = config.host_prefix;
const FILE_PREFIX = config.file_prefix;
const EE_HOST = config.ee_host;

var app = express();
app.use(bodyParser.urlencoded({ limit:'10mb', extended: true }));
app.use(bodyParser.json({limit: '10mb'}));

app.post(HOST_PREFIX+'/member/login', member.login);
app.put(HOST_PREFIX+'/member/liveordie', member.liveordie);
app.put(HOST_PREFIX+'/member/update', member.update);
app.put(HOST_PREFIX+'/member/callhelp', member.callhelp);
app.get(HOST_PREFIX+'/member/read', member.read);
app.put(HOST_PREFIX+'/member/money', member.money);
app.put(HOST_PREFIX+'/member/score', member.score);

app.post(HOST_PREFIX+'/mission/create', mission.create);
app.put(HOST_PREFIX+'/mission/edit', mission.edit);
app.delete(HOST_PREFIX+'/mission/delete', mission.delete);
app.get(HOST_PREFIX+'/mission/read', mission.read);

app.post(HOST_PREFIX+'/report/create', report.create);
app.put(HOST_PREFIX+'/report/check', report.check);
app.put(HOST_PREFIX+'/report/edit', report.edit);
app.delete(HOST_PREFIX+'/report/delete', report.delete);
app.get(HOST_PREFIX+'/report/read', report.read);

app.post(HOST_PREFIX+'/tool/create', tool.create);
app.delete(HOST_PREFIX+'/tool/delete', tool.delete);
app.get(HOST_PREFIX+'/tool/read', tool.read);

app.post(HOST_PREFIX+'/clue/create', clue.create);
app.delete(HOST_PREFIX+'/clue/delete', clue.delete);
app.get(HOST_PREFIX+'/clue/read', clue.read);

app.post(HOST_PREFIX+'/pack/create', pack.create);
app.delete(HOST_PREFIX+'/pack/delete', pack.delete);
app.get(HOST_PREFIX+'/pack/read', pack.read);

app.get(HOST_PREFIX+'/download/:type/:filename', function(req, res){
    console.log("Getting file " + req.params.type + '/' + req.params.filename);

    filename = path.join(ROOT_PATH, FILE_PREFIX, req.params.type, req.params.filename);
    if (fs.existsSync(filename)){
		console.log('Sending file ' + filename);
        res.sendFile(filename);
    } else {
		console.log('File not found ' + filename);
        res.status(404);
		res.send('File not found');
    }
});

app.get(HOST_PREFIX+'/utility/:squad', function(req, res){
	var squad = req.params.squad;
	console.log("Getting contact of group " + squad);

	request.get({url:EE_HOST+'/contact.php?squad='+squad+'&token='+process.env.TOKEN},
		function optionalCallback(err, httpResponse, body) {
			if (err) {
				console.log('Failed! Getting contact information error:', err);
			}
			else if (httpResponse.statusCode == 200){
				console.log('Success! Get the contact information of group '+squad+'.');
			}
			else{
				console.log('Failed! Cannot access contact information of group '+squad+'.');
			}
			res.status(httpResponse.statusCode);
			res.json(JSON.parse(body));
		}
	);
});

var server = app.listen(PORT, function () {
    var port =  server.address().port;
    console.log("Start Server at " + port);
});
