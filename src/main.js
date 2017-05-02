var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var member = require(path.join(ROOT_PATH, 'src/member.js'));
var mission = require(path.join(ROOT_PATH, 'src/mission.js'));
var clue = require(path.join(ROOT_PATH, 'src/clue.js'));
var pack = require(path.join(ROOT_PATH, 'src/pack.js'));
var tool = require(path.join(ROOT_PATH, 'src/tool.js'));
var report = require(path.join(ROOT_PATH, 'src/report.js'));
if (process.env.NODE_ENV === 'production'){
    var config = require(path.join(ROOT_PATH, 'src/config_production.json'));
} else if (process.env.NODE_ENV === 'test') {
    var config = require(path.join(ROOT_PATH, 'src/config_staging.json'));
} else {
    throw 'Environment setting error! Please set NODE_ENV Environment variable';
}
var PORT = config.port;
var HOST = config.host;
var HOST_PREFIX = config.host_prefix;
var FILE_PREFIX = config.file_prefix;

var app = express();
app.use(bodyParser.urlencoded({ limit:'10mb', extended: true }));
app.use(bodyParser.json({limit: '10mb'}));

app.post(HOST_PREFIX+'/member/login', member.login);
app.put(HOST_PREFIX+'/member/liveordie', member.liveordie);
app.put(HOST_PREFIX+'/member/update', member.update);
app.put(HOST_PREFIX+'/member/callhelp', member.callhelp);
app.get(HOST_PREFIX+'/member/read', member.read);
app.put(HOST_PREFIX+'/member/money', member.money);

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
    console.log("Getting file" + req.params.type + '/' + req.params.filename);
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
var server = app.listen(PORT, function () {
    var port =  server.address().port;
    console.log("Start Server at " + port);
});
