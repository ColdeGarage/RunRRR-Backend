process.env.NODE_ENV = 'test';

var chai = require('chai')
  , chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;
var path = require('path')
var config = require('./config.json');
var PORT = config.port
var HOST = 'http://' + config.host + ':' + PORT;
var HOST_PREFIX = config.host_prefix;
chai.use(chaiHttp);

describe('Member Api', function(){
    it('/PUT liveordie', function(done) { // <= Pass in done callback
        var req = {'operator_uid':0, 'uid':12, 'status':1};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'liveordie'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('liveordie');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('status').eql(1);
            done();
        });
    });
    it('/PUT liveordie(uncomplete request)', function(done) { 
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'liveordie'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('liveordie');
            res.body.should.have.property('brea').eql(2);
            done();
        });
    });
    it('/PUT update', function(done) { // <= Pass in done callback
        var req = {'operator_uid':0, 'uid':12, 'status':1, 'position_e':'120.13', 'position_n':'23.456'};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'update'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('update');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('valid_area').eql(1);

            done();
        });
    });
    it('/PUT update(Uncomplete request)', function(done) { // <= Pass in done callback
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'update'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('update');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/PUT callhelp', function(done) { // <= Pass in done callback
        var req = {'operator_uid':0, 'uid':12, 'status':1, 'position_e':'120.13', 'position_n':'23.456'};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'callhelp'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('callhelp');
            res.body.should.have.property('brea').to.be.an('number');

            done();
        });
    });
    it('/PUT callhelp(Uncomplete request)', function(done) { // <= Pass in done callback
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'callhelp'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('callhelp');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/GET read(with uid)', function(done) { 
        var req = {'operator_uid':0, 'uid':12};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'member', 'read'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('Objects').to.be.an('array');
            res.body.payload.Objects.length.should.eql(1);
            for (member in res.body.payload.Objects){
                member.should.have.property('uid').to.be.an('number');
                member.should.have.property('money').to.be.an('number');
                member.should.have.property('status').to.be.an('number');
                member.should.have.property('position_e').to.be.an('number');
                member.should.have.property('position_n').to.be.an('number');
                member.should.have.property('score').to.be.an('number');
                member.should.have.property('name').to.be.an('string');
            }
            done();
        });
    });
    it('/GET read(with out uid)', function(done) { 
        var req = {'operator_uid':0};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'member', 'read'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('Objects').to.be.an('array');
            for (member in res.body.payload.Objects){
                member.should.have.property('uid').to.be.an('number');
                member.should.have.property('money').to.be.an('number');
                member.should.have.property('status').to.be.an('number');
                member.should.have.property('position_e').to.be.an('number');
                member.should.have.property('position_n').to.be.an('number');
                member.should.have.property('score').to.be.an('number');
                member.should.have.property('name').to.be.an('string');
            }
            done();
        });
    });
    it('/GET read(Uncomplete request)', function(done) { // <= Pass in done callback
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'member', 'read'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/POST login', function(done) { 
        var req = {'operator_uid':0, 'email':'abcd@gmail.com', 'password':'xxxxx'};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'member', 'login'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').to.be.a('number');
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('login');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('correct').to.be.a('number');

            done();
        });
    });
    it('/POST login(Uncomplete request)', function(done) { // <= Pass in done callback
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'member', 'login'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('login');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/PUT money', function(done) { 
        var req = {'operator_uid':0, 'uid':12, 'money_amount':-50};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'money'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('money');
            res.body.should.have.property('brea').eql(0);

            done();
        });
    });
    it('/PUT money(Uncomplete request)', function(done) { // <= Pass in done callback
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'money'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('money');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
});



describe('Mission Api', function(){
    it('/POST create', function(done) { // <= Pass in done callback
        var req = {'operator_uid':0, 'title':'Test Mission', 'content':'This is a test mission.',
                   'time_start':!!!!, 'time_end':!!!!, 'prize':250, 'clue':12, 'class':0, 'score':100,
                   'location_e':123.33, 'location_n':25.32};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'mission', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('mid').to.be.a('number');
            done();
        });
    });
    it('/POST create(uncomplete request)', function(done) { 
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'mission', 'create'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(2);
            done();
        });
    });
    it('/PUT edit', function(done) { 
        var req = {'operator_uid':0, 'mid':11, 'contexnt':'modified Test mission'};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'mission', 'edit'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('edit');
            res.body.should.have.property('brea').eql(0);

            done();
        });
    });
    // !!!!(may add undefine mid)
    it('/PUT edit(Uncomplete request)', function(done) { // <= Pass in done callback
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'mission', 'edit'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('edit');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/DEL delete', function(done) { // <= Pass in done callback
        var req = {'operator_uid':0, 'mid':10};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'mission', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(0);

            done();
        });
    });
    it('/DEL delete(Uncomplete request)', function(done) { // <= Pass in done callback
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'mission', 'delete'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/GET read(with mid)', function(done) { 
        var req = {'operator_uid':0, 'mid':11};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'mission', 'read'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('Objects').to.be.an('array');
            res.body.payload.Objects.length.should.eql(1);
            for (mission in res.body.payload.Objects){
                mission.should.have.property('mid').to.be.a('number');
                mission.should.have.property('title').to.be.a('string');
                mission.should.have.property('content').to.be.a('string');
                mission.should.have.property('time_start').to.be.a('string');
                mission.should.have.property('time_end').to.be.a('string');
                mission.should.have.property('prize').to.be.a('number');
                mission.should.have.property('clue').to.be.a('number');
                mission.should.have.property('class').to.be.a('number');
                mission.should.have.property('score').to.be.a('number');
                mission.should.have.property('location_e').to.be.a('number');
                mission.should.have.property('location_n').to.be.a('number');
            }
            done();
        });
    });
    it('/GET read(with out uid)', function(done) { 
        var req = {'operator_uid':0};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'mission', 'read'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('Objects').to.be.an('array');
            for (mission in res.body.payload.Objects){
                mission.should.have.property('mid').to.be.a('number');
                mission.should.have.property('title').to.be.a('string');
                mission.should.have.property('content').to.be.a('string');
                mission.should.have.property('time_start').to.be.a('string');
                mission.should.have.property('time_end').to.be.a('string');
                mission.should.have.property('prize').to.be.a('number');
                mission.should.have.property('clue').to.be.a('number');
                mission.should.have.property('class').to.be.a('number');
                mission.should.have.property('score').to.be.a('number');
                mission.should.have.property('location_e').to.be.a('number');
                mission.should.have.property('location_n').to.be.a('number');
            }
            done();
        });
    });
    it('/GET read(Uncomplete request)', function(done) { // <= Pass in done callback
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'mission', 'read'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
});

