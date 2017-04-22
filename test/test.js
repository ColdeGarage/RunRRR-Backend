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
    it('/PUT liveordie', function(done) { 
        var req = {'operator_uid':0, 'uid':289, 'status':0};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'liveordie'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('uid').eql(0);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('liveordie');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('status').eql(1);
            
            done();
        });
    });
    it('/PUT liveordie(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'liveordie'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('liveordie');
            res.body.should.have.property('brea').eql(2);
            
            done();
        });
    });
    it('/PUT update', function(done) { 
        var req = {'operator_uid':0, 'uid':289, 'position_e':'120.992135', 'position_n':'24.795156'};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'update'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('uid').eql(0);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('update');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('valid_area').eql(1);
            
            done();
        });
    });
    it('/PUT update(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'update'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('update');
            res.body.should.have.property('brea').eql(2);
            
            done();
        });
    });
    it('/PUT callhelp', function(done) { 
        var req = {'operator_uid':0, 'uid':289, 'status':1, 'position_e':'120.13', 'position_n':'23.456'};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'callhelp'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(0);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('callhelp');
            res.body.should.have.property('brea').to.be.an('number');
            
            done();
        });
    });
    it('/PUT callhelp(Uncomplete request)', function(done) { 
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
        var req = {'operator_uid':0, 'uid':289};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'member', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(0);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            res.body.payload.objects.length.should.eql(1);
            for (member in res.body.payload.objects){
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
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(0);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (member in res.body.payload.objects){
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
    it('/GET read(Uncomplete request)', function(done) { 
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
        var req = {'email':'qmo123@gmail.com', 'password':'S123456789'};
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
    it('/POST login(Uncomplete request)', function(done) { 
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
        var req = {'operator_uid':0, 'uid':289, 'money_amount':50};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'money'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(0);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('money');
            res.body.should.have.property('brea').eql(0);

            done();
        });
    });
    it('/PUT money(Uncomplete request)', function(done) { 
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

var test_mid;
describe('Mission Api', function(){
    it('/POST create', function(done) { 
        var req = {'operator_uid':12, 'title':'Test Mission', 'content':'This is a test mission.',
                   'time_start':'2017-06-13 04:22:23', 'time_end':'2017-06-13 04:32:23',
                   'prize':250, 'clue':12, 'class':'MAIN', 'score':100,
                   'location_e':123.33, 'location_n':25.32};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'mission', 'create'))
        .send(req)
        .end(function(err, res) {
            test_mid = res.body.mid;
            
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
        var req = {'operator_uid':12, 'mid':test_mid, 'content':'modified Test mission'};
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
    it('/PUT edit(Uncomplete request)', function(done) { 
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
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':12, 'mid':test_mid};
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
    it('/DEL delete(Uncomplete request)', function(done) { 
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
        var req = {'operator_uid':12, 'mid':1};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'mission', 'read'))
        .query(req)
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
            res.body.payload.should.have.property('objects').to.be.an('array');
            res.body.payload.objects.length.should.eql(1);
            for (mission in res.body.payload.objects){
                mission.should.have.property('mid').to.be.a('number');
                mission.should.have.property('title').to.be.a('string');
                mission.should.have.property('content').to.be.a('string');
                mission.should.have.property('time_start').to.be.a('string');
                mission.should.have.property('time_end').to.be.a('string');
                mission.should.have.property('prize').to.be.a('number');
                mission.should.have.property('clue').to.be.a('number');
                mission.should.have.property('class').to.be.a('string');
                mission.should.have.property('score').to.be.a('number');
                mission.should.have.property('location_e').to.be.a('number');
                mission.should.have.property('location_n').to.be.a('number');
            }
            
            done();
        });
    });
    it('/GET read(with out mid)', function(done) { 
        var req = {'operator_uid':12};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'mission', 'read'))
        .query(req)
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
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (mission in res.body.payload.objects){
                mission.should.have.property('mid').to.be.a('number');
                mission.should.have.property('title').to.be.a('string');
                mission.should.have.property('content').to.be.a('string');
                mission.should.have.property('time_start').to.be.a('string');
                mission.should.have.property('time_end').to.be.a('string');
                mission.should.have.property('prize').to.be.a('number');
                mission.should.have.property('clue').to.be.a('number');
                mission.should.have.property('class').to.be.a('string');
                mission.should.have.property('score').to.be.a('number');
                mission.should.have.property('location_e').to.be.a('number');
                mission.should.have.property('location_n').to.be.a('number');
            }
            
            done();
        });
    });
    it('/GET read(Uncomplete request)', function(done) { 
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

describe('Report Api', function(){
    it('/POST create', function(done) { 
        var req = {'operator_uid':12, 'mid':12, 'url':'coldegarage.tech'};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'report', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('rid').to.be.a('number');
            done();
        });
    });
    it('/POST create(uncomplete request)', function(done) { 
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'report', 'create'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(2);
            done();
        });
    });
    it('/PUT check', function(done) { 
        var req = {'operator_uid':12, 'rid':11, 'status':1};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'report', 'check'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('check');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('status').eql(1);

            done();
        });
    });
    // !!!!(may add undefine mid)
    it('/PUT check(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'report', 'check'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('check');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/PUT edit', function(done) { 
        var req = {'operator_uid':12, 'rid':11, 'url':'test.123.com'};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'report', 'edit'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('edit');
            res.body.should.have.property('brea').eql(0);

            done();
        });
    });
    // !!!!(may add undefine mid)
    it('/PUT edit(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'report', 'edit'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('edit');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':12, 'rid':11};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'report', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(0);

            done();
        });
    });
    it('/DEL delete(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'report', 'delete'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/GET read(with rid)', function(done) { 
        var req = {'operator_uid':12, 'rid':11};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'report', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            res.body.payload.objects.length.should.eql(1);
            for (report in res.body.payload.objects){
                report.should.have.property('rid').eql(11);
                report.should.have.property('uid').eql(12);
                report.should.have.property('mid').to.be.a('number');
                report.should.have.property('url').to.be.a('string');
                report.should.have.property('status').to.be.a('number');
                report.should.have.property('time').to.be.a('string');
            }
            done();
        });
    });
    it('/GET read(with out rid)', function(done) { 
        var req = {'operator_uid':12};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'report', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (report in res.body.payload.objects){
                report.should.have.property('rid').to.be.a('number');
                report.should.have.property('uid').eql(12);
                report.should.have.property('mid').to.be.a('number');
                report.should.have.property('url').to.be.a('string');
                report.should.have.property('status').to.be.a('number');
                report.should.have.property('time').to.be.a('string');
            }
            done();
        });
    });
    it('/GET read(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'report', 'read'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
});

var test_tid;
describe('Tool Api', function(){
    it('/POST create', function(done) { 
        var req = {'operator_uid':12, 'title':'Test tool', 'content':'This is a test tool'
                   ,'url':'coldegarage.tech/test.jpg', 'expire':10, 'price':100};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'tool', 'create'))
        .send(req)
        .end(function(err, res) {
            test_tid = res.body.tid;

            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('tid').to.be.a('number');
            
            done();
        });
    });
    it('/POST create(uncomplete request)', function(done) { 
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'tool', 'create'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(2);
            
            done();
        });
    });
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':12, 'tid':test_tid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'tool', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(0);

            done();
        });
    });
    it('/DEL delete(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'tool', 'delete'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/GET read(with tid)', function(done) { 
        var req = {'operator_uid':12, 'tid':1};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'tool', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            res.body.payload.objects.length.should.eql(1);
            for (tool in res.body.payload.objects){
                tool.should.have.property('tid').eql(11);
                tool.should.have.property('title').to.be.a('string');
                tool.should.have.property('content').to.be.a('string');
                tool.should.have.property('url').to.be.a('string');
                tool.should.have.property('expire').to.be.a('number');
                tool.should.have.property('price').to.be.a('number');
            }
            
            done();
        });
    });
    it('/GET read(with out tid)', function(done) { 
        var req = {'operator_uid':12};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'tool', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (tool in res.body.payload.objects){
                tool.should.have.property('tid').to.be.a('number');
                tool.should.have.property('title').to.be.a('string');
                tool.should.have.property('content').to.be.a('string');
                tool.should.have.property('url').to.be.a('string');
                tool.should.have.property('expire').to.be.a('number');
                tool.should.have.property('price').to.be.a('number');
            }
            done();
        });
    });
    it('/GET read(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'tool', 'read'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
});

var test_cid;
describe('Clue Api', function(){
    it('/POST create', function(done) { 
        var req = {'operator_uid':12, 'content':'This is a test clue'};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'clue', 'create'))
        .send(req)
        .end(function(err, res) {
            test_cid = res.body.cid;            

            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('clue');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('cid').to.be.a('number');
            done();
        });
    });
    it('/POST create(uncomplete request)', function(done) { 
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'clue', 'create'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('clue');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(2);
            done();
        });
    });
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':12, 'cid':test_cid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'clue', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('clue');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(0);

            done();
        });
    });
    it('/DEL delete(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'clue', 'delete'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('clue');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/GET read(with cid)', function(done) { 
        var req = {'operator_uid':12, 'cid':1};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'clue', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('clue');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            res.body.payload.objects.length.should.eql(1);
            for (clue in res.body.payload.objects){
                clue.should.have.property('cid').eql(8);
                clue.should.have.property('content').to.be.a('string');
            }
            done();
        });
    });
    it('/GET read(with out cid)', function(done) { 
        var req = {'operator_uid':12};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'clue', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('clue');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (clue in res.body.payload.objects){
                clue.should.have.property('cid').to.be.a('number');
                clue.should.have.property('content').to.be.a('string');
            }
            done();
        });
    });
    it('/GET read(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'clue', 'read'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('clue');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
});

var test_pid;
describe('Pack Api', function(){
    it('/POST create', function(done) { 
        var req = {'operator_uid':12, 'uid':'13', 'class':'TOOL', 'id':13};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'pack', 'create'))
        .send(req)
        .end(function(err, res) {
            test_pid = res.body.pid;

            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('pack');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('pid').to.be.a('number');
            done();
        });
    });
    it('/POST create(uncomplete request)', function(done) { 
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'pack', 'create'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('pack');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(2);
            done();
        });
    });
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':12, 'pid':test_pid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'pack', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('pack');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(0);

            done();
        });
    });
    it('/DEL delete(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'pack', 'delete'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('pack');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
    it('/GET read(with pid)', function(done) { 
        var req = {'operator_uid':12, 'pid':1};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'pack', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('pack');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            res.body.payload.objects.length.should.eql(1);
            for (pack in res.body.payload.objects){
                pack.should.have.property('pid').eql(8);
                pack.should.have.property('uid').eql(12);
                pack.should.have.property('class').to.be.a('string');
                pack.should.have.property('id').to.be.a('number');
            }
            done();
        });
    });
    it('/GET read(with out pid)', function(done) { 
        var req = {'operator_uid':12};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'pack', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('pack');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (pack in res.body.payload.objects){
                pack.should.have.property('pid').to.be.a('number');
                pack.should.have.property('uid').eql(12);
                pack.should.have.property('class').to.be.a('string');
                pack.should.have.property('id').to.be.a('number');
            }
            done();
        });
    });
    it('/GET read(Uncomplete request)', function(done) { 
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'pack', 'read'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('object').eql('pack');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(2);

            done();
        });
    });
});