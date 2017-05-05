if (process.env.NODE_ENV !== 'test'){
    throw "Environment setting error! Please set NODE_ENV=test for testing"
}
var path = require('path');
var chai = require('chai')
  , chaiHttp = require('chai-http');
var should = chai.should();
var expect = chai.expect;
var fs = require('fs');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
var config = require(path.join(ROOT_PATH, 'src/config_staging.json'));
var PORT = config.port;
var HOST = 'http://' + config.host + ':' + PORT;
var HOST_PREFIX = config.host_prefix;
var server = require('../src/main.js');
var db = require('../src/db.js');
var conn = db.conn();

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
            res.body.should.have.property('server_time').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');
            
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
            res.body.should.have.property('server_time').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');
            
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
            res.body.should.have.property('server_time').to.be.a('string');
            
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
            res.body.should.have.property('server_time').to.be.a('string');
            
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            res.body.payload.objects.length.should.eql(1);
            for (member in res.body.payload.objects){
                res.body.payload.objects[member].should.have.property('uid').to.be.an('number');
                res.body.payload.objects[member].should.have.property('money').to.be.an('number');
                res.body.payload.objects[member].should.have.property('status').to.be.an('number');
                res.body.payload.objects[member].should.have.property('position_e').to.be.an('number');
                res.body.payload.objects[member].should.have.property('position_n').to.be.an('number');
                res.body.payload.objects[member].should.have.property('score').to.be.an('number');
                res.body.payload.objects[member].should.have.property('name').to.be.an('string');
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (member in res.body.payload.objects){
                res.body.payload.objects[member].should.have.property('uid').to.be.an('number');
                res.body.payload.objects[member].should.have.property('money').to.be.an('number');
                res.body.payload.objects[member].should.have.property('status').to.be.an('number');
                res.body.payload.objects[member].should.have.property('position_e').to.be.an('number');
                res.body.payload.objects[member].should.have.property('position_n').to.be.an('number');
                res.body.payload.objects[member].should.have.property('score').to.be.an('number');
                res.body.payload.objects[member].should.have.property('name').to.be.an('string');
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
            res.body.should.have.property('server_time').to.be.a('string');
            
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
            res.body.should.have.property('server_time').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');
            
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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
});


var test_mid = '';
describe('Mission Api', function(){
    beforeEach(function(){
        var test_mission = {
            'title':'Test Mission', 'content':'This is a test mission.',
            'time_start':'2017-06-13 04:22:23', 'time_end':'2017-06-13 04:32:23',
            'prize':250, 'clue':12, 'class':'MAIN', 'score':100,
            'location_e':123.33, 'location_n':25.32
        };
        conn.query('INSERT INTO mission SET ?', test_mission, function(err, result){
            if (err){
                throw 'create test mission error:' + err;
            } else {
                test_mid = result.insertId;
            }
        })

    });
    after(function(){
        conn.query('DELETE from mission WHERE title = "Test Mission"', function(err, result){
            if (err){
				console.log(err);
                throw 'delete test mission error:' + err;
            }
        })
    });
    it('/POST create', function(done) { 
        var req = {'operator_uid':12, 'title':'Test Mission', 'content':'This is a test mission.',
                   'time_start':'2017-06-13 04:22:23', 'time_end':'2017-06-13 04:32:23',
                   'prize':250, 'clue':12, 'class':'MAIN', 'score':100,
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
            res.body.should.have.property('server_time').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');
            
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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/GET read(with mid)', function(done) { 
        var req = {'operator_uid':12, 'mid':test_mid};
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            res.body.payload.objects.length.should.eql(1);
            for (mission in res.body.payload.objects){
                res.body.payload.objects[mission].should.have.property('mid').to.be.a('number');
                res.body.payload.objects[mission].should.have.property('title').to.be.a('string');
                res.body.payload.objects[mission].should.have.property('content').to.be.a('string');
                res.body.payload.objects[mission].should.have.property('time_start').to.be.a('string');
                res.body.payload.objects[mission].should.have.property('time_end').to.be.a('string');
                res.body.payload.objects[mission].should.have.property('prize').to.be.a('number');
                res.body.payload.objects[mission].should.have.property('clue').to.be.a('number');
                res.body.payload.objects[mission].should.have.property('class').to.be.a('string');
                res.body.payload.objects[mission].should.have.property('score').to.be.a('number');
                res.body.payload.objects[mission].should.have.property('location_e').to.be.a('number');
                res.body.payload.objects[mission].should.have.property('location_n').to.be.a('number');
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (mission in res.body.payload.objects){
                res.body.payload.objects[mission].should.have.property('mid').to.be.a('number');
                res.body.payload.objects[mission].should.have.property('title').to.be.a('string');
                res.body.payload.objects[mission].should.have.property('content').to.be.a('string');
                res.body.payload.objects[mission].should.have.property('time_start').to.be.a('string');
                res.body.payload.objects[mission].should.have.property('time_end').to.be.a('string');
                res.body.payload.objects[mission].should.have.property('prize').to.be.a('number');
                res.body.payload.objects[mission].should.have.property('clue').to.be.a('number');
                res.body.payload.objects[mission].should.have.property('class').to.be.a('string');
                res.body.payload.objects[mission].should.have.property('score').to.be.a('number');
                res.body.payload.objects[mission].should.have.property('location_e').to.be.a('number');
                res.body.payload.objects[mission].should.have.property('location_n').to.be.a('number');
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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
});


var image_data;
var base64_image;
var test_rid;
describe('Report Api', function(){
    before(function(){
        image_data = fs.readFileSync(path.join(ROOT_PATH, 'test/data/img/test.jpg'));
        base64_image = new Buffer(image_data).toString('base64');
    });
    beforeEach(function(){
        var test_report = {
            'uid':-1, 'mid':5, 'url':'report-m5-u-1.jpg',
            'status':0, 'time':'2017-04-30T14:00:00.000Z'
        };
        conn.query('INSERT INTO report SET ?', test_report, function(err, result){
            if (err){
                throw 'create test report error:' + err;
            } else {
                test_rid = result.insertId;
            }
        })
    });
    after(function(){
        conn.query('DELETE FROM report WHERE uid = -1 OR uid = 12', function(err, result){
            if (err){
                console.log(err);
                throw 'delete test report error:' + err;
            }
        })
        fs.unlinkSync(path.join(ROOT_PATH, '/test/data/img/report-m10-u12.jpg'))
        fs.unlinkSync(path.join(ROOT_PATH, '/test/data/img/report-m5-u-1.jpg'))
    });
    it('/POST create', function(done) { 
        var req = {'operator_uid':12, 'mid':10, 'image':base64_image};
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('rid').to.be.a('number');
            expect(fs.existsSync(path.join(ROOT_PATH, '/test/data/img/report-m10-u12.jpg'))).eql(true);
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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/PUT check', function(done) { 
        var req = {'operator_uid':12, 'rid':test_rid, 'status':1};
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
            res.body.should.have.property('server_time').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/PUT edit', function(done) { 
        var req = {'operator_uid':12, 'rid':test_rid, 'image':base64_image};
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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':12, 'rid':test_rid};
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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/GET read(with mid)', function(done) { 
        var req = {'operator_uid':12, 'mid':5};
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            // res.body.payload.objects.length.should.eql(1);
            for (report in res.body.payload.objects){
                res.body.payload.objects[report].should.have.property('rid').to.be.a('number');
                res.body.payload.objects[report].should.have.property('uid').to.be.a('number');
                res.body.payload.objects[report].should.have.property('mid').eql(5);
                res.body.payload.objects[report].should.have.property('url').to.be.a('string');
                res.body.payload.objects[report].should.have.property('status').to.be.a('number');
                res.body.payload.objects[report].should.have.property('time').to.be.a('string');
            }
            done();
        });
    });
    it('/GET read(with uid)', function(done) { 
        var req = {'operator_uid':12, 'uid':-1};
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (report in res.body.payload.objects){
                res.body.payload.objects[report].should.have.property('rid').to.be.a('number');
                res.body.payload.objects[report].should.have.property('uid').eql(-1);
                res.body.payload.objects[report].should.have.property('mid').to.be.a('number');
                res.body.payload.objects[report].should.have.property('url').to.be.a('string');
                res.body.payload.objects[report].should.have.property('status').to.be.a('number');
                res.body.payload.objects[report].should.have.property('time').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
});

var test_tid;
describe('Tool Api', function(){
    beforeEach(function(){
        var test_tool = {
            'title':'Test tool', 'content':'This is a test tool',
            'url':'coldegarage.tech/test.jpg', 'expire':10, 'price':100
        };

        conn.query('INSERT INTO tool SET ?', test_tool, function(err, result){
            if (err){
                throw 'create test tool error:' + err;
            } else {
                test_tid = result.insertId;
            }
        })

    });
    after(function(){
        conn.query('DELETE FROM tool WHERE title = "Test tool"', function(err, result){
            if (err){
                throw 'delete test tool error:' + err;
            }
        })
    })
    it('/POST create', function(done) { 
        var req = {'operator_uid':12, 'title':'Test tool', 'content':'This is a test tool'
                   ,'url':'coldegarage.tech/test.jpg', 'expire':10, 'price':100};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'tool', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('server_time').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');
            
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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/GET read(with tid)', function(done) { 
        var test_read_tid = test_tid;
        var req = {'operator_uid':12, 'tid':test_read_tid};
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            res.body.payload.objects.length.should.eql(1);
            for (tool in res.body.payload.objects){
                res.body.payload.objects[tool].should.have.property('tid').eql(test_read_tid);
                res.body.payload.objects[tool].should.have.property('title').to.be.a('string');
                res.body.payload.objects[tool].should.have.property('content').to.be.a('string');
                res.body.payload.objects[tool].should.have.property('url').to.be.a('string');
                res.body.payload.objects[tool].should.have.property('expire').to.be.a('number');
                res.body.payload.objects[tool].should.have.property('price').to.be.a('number');
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (tool in res.body.payload.objects){
                res.body.payload.objects[tool].should.have.property('tid').to.be.a('number');
                res.body.payload.objects[tool].should.have.property('title').to.be.a('string');
                res.body.payload.objects[tool].should.have.property('content').to.be.a('string');
                res.body.payload.objects[tool].should.have.property('url').to.be.a('string');
                res.body.payload.objects[tool].should.have.property('expire').to.be.a('number');
                res.body.payload.objects[tool].should.have.property('price').to.be.a('number');
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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
});

var test_cid;
describe('Clue Api', function(){
    beforeEach(function(){
        var test_clue = {
            'content':'This is a test clue'
        };

        conn.query('INSERT INTO clue SET ?', test_clue, function(err, result){
            if (err){
                throw 'create test clue error:' + err;
            } else {
                test_cid = result.insertId;
            }
        })

    });
    after(function(){
        conn.query('DELETE from clue WHERE content = "This is a test clue"', function(err, result){
            if (err){
                throw 'delete test clue error:' + err;
            }
        })
    })
    it('/POST create', function(done) { 
        var req = {'operator_uid':12, 'content':'This is a test clue'};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'clue', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('clue');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('server_time').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/GET read(with cid)', function(done) {
        var test_read_cid = test_cid;
        var req = {'operator_uid':12, 'cid':test_read_cid};
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            res.body.payload.objects.length.should.eql(1);
            for (clue in res.body.payload.objects){
                res.body.payload.objects[clue].should.have.property('cid').eql(test_read_cid);
                res.body.payload.objects[clue].should.have.property('content').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (clue in res.body.payload.objects){
                res.body.payload.objects[clue].should.have.property('cid').to.be.a('number');
                res.body.payload.objects[clue].should.have.property('content').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
});

var test_pid;
describe('Pack Api', function(){
    beforeEach(function(){
        var test_pack = {'uid':-1, 'class':'TOOL', 'id':13};

        conn.query('INSERT INTO pack SET ?', test_pack, function(err, result){
            if (err){
                throw 'create test pack error:' + err;
            } else {
                test_pid = result.insertId;
            }
        })

    });
    after(function(){
        conn.query('DELETE FROM pack WHERE uid = -1', function(err, result){
            if (err){
                throw 'delete test pack error:' + err;
            }
        })
    })
    it('/POST create', function(done) { 
        var req = {'operator_uid':12, 'uid':'-1', 'class':'TOOL', 'id':13};
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
            res.body.should.have.property('server_time').to.be.a('string');
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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/GET read(with pid)', function(done) { 
        var req = {'operator_uid':12, 'uid':-1};
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            //res.body.payload.objects.length.should.eql(1);
            for (pack in res.body.payload.objects){
                res.body.payload.objects[pack].should.have.property('pid').to.be.a('number');
                res.body.payload.objects[pack].should.have.property('uid').eql(-1);
                res.body.payload.objects[pack].should.have.property('class').to.be.a('string');
                res.body.payload.objects[pack].should.have.property('id').to.be.a('number');
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
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (pack in res.body.payload.objects){
                res.body.payload.objects[pack].should.have.property('pid').to.be.a('number');
                res.body.payload.objects[pack].should.have.property('uid').to.be.a('number');
                res.body.payload.objects[pack].should.have.property('class').to.be.a('string');
                res.body.payload.objects[pack].should.have.property('id').to.be.a('number');
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
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
});


describe('Download API', function(){
    it('/GET download (image)', function(done) { 
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'download', 'img', 'test.jpg'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
			expect(res.headers['content-length']).to.be.a('string').eql('7207');
            done();
        });
    });

    it('/GET download (kml)', function(done) { 
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'download', 'map', 'boundary.kml'))
        .end(function(err, res) {
            expect(res).to.have.status(200);
			expect(res.headers['content-length']).to.be.a('string').eql('2876');
            done();
        });
    });

    it('/GET download (non exist)', function(done) { 
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'download', 'img', 'NON_EXIST.jpg'))
        .end(function(err, res) {
            expect(res).to.have.status(404);
            done();
        });
    });
});