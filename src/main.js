
var express = require('express');
var bodyParser = require('body-parser');
var member = require('./member.js');
var mission = require('./mission.js');
var clus = require('./clue.js');
var pack = require('./pack.js');
var tool = require('./tool.js');
var report = require('./report.js');
var config = require('./config.json');
var PORT = config.port
var HOST = config.host;
var HOST_PREFIX = config.host_prefix;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.put(HOST_PREFIX+'/member/liveordie', member.liveordie);
app.put(HOST_PREFIX+'/member/update', member.update);
app.put(HOST_PREFIX+'/member/callhelp', member.callhelp);
app.get(HOST_PREFIX+'/member/read', member.read);
app.post(HOST_PREFIX+'/member/login', member.login);
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

app.post(HOST_PREFIX+'/boundary/create', boundary.create);
app.put(HOST_PREFIX+'/boundary/edit', boundary.edit);
app.delete(HOST_PREFIX+'/boundary/delete', boundary.delete);
app.get(HOST_PREFIX+'/boundary/read', boundary.read);

var server = app.listen(PORT, function () {
    var port =  server.address().port;
    console.log("Start Server at " + port);
});