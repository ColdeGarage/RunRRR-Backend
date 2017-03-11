
var express = require('express');
var bodyParser = require('body-parser');
var member = require('./member.js');
var mission = require('./mission.js');
var clus = require('./clue.js');
var pack = require('./pack.js');
var tool = require('./tool.js');
var report = require('./report.js');
var PREFIX = '/api/v1';

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.put(PREFIX+'/member/liveordie', member.liveordie);
app.put(PREFIX+'/member/update', member.update);
app.put(PREFIX+'/member/callhelp', member.callhelp);
app.get(PREFIX+'/member/read', member.read);
app.post(PREFIX+'/member/login', member.login);
app.put(PREFIX+'/member/money', member.money);

app.post(PREFIX+'/mission/create', mission.create);
app.put(PREFIX+'/mission/edit', mission.edit);
app.delete(PREFIX+'/mission/delete', mission.delete);
app.get(PREFIX+'/mission/read', mission.read);

app.post(PREFIX+'/report/create', report.create);
app.put(PREFIX+'/report/check', report.check);
app.put(PREFIX+'/report/edit', report.edit);
app.delete(PREFIX+'/report/delete', report.delete);
app.get(PREFIX+'/report/read', report.read);

app.post(PREFIX+'/tool/create', tool.create);
app.delete(PREFIX+'/tool/delete', tool.delete);
app.get(PREFIX+'/tool/read', tool.read);

app.post(PREFIX+'/clue/create', clue.create);
app.delete(PREFIX+'/clue/delete', clue.delete);
app.get(PREFIX+'/clue/read', clue.read);

app.post(PREFIX+'/pack/create', pack.create);
app.delete(PREFIX+'/pack/delete', pack.delete);
app.get(PREFIX+'/pack/read', pack.read);

app.post(PREFIX+'/boundary/create', boundary.create);
app.put(PREFIX+'/boundary/edit', boundary.edit);
app.delete(PREFIX+'/boundary/delete', boundary.delete);
app.get(PREFIX+'/boundary/read', boundary.read);

var server = app.listen(3000, function () {
    var port =  server.address().port;
    console.log("Start Server at port "+port);
});