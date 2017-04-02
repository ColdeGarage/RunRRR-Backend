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
            res.body.should.have.property('brea').eql(1);
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
            res.body.should.have.property('brea').eql(1);
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


