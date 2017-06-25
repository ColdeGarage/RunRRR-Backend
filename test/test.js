if (process.env.NODE_ENV !== 'test'){
    throw "Environment setting error! Please set NODE_ENV=test for testing"
}
var request = require('request');
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

const ADMIN_UID = 87;
const ADMIN_TOKEN = 'a1b2c3d4e5f6g7h8i9j0k';
const EMAIL = 'qmo123@gmail.com';
const PASS = 'S123456789';

var player_uid;
var player_token;

before(function(done){
    var req = {'email':EMAIL, 'password':PASS};
    var url = HOST+path.join(HOST_PREFIX, 'member', 'login')
    request.post({url: url, form: req},
    function(err, httpResponse, body){
        var player = JSON.parse(body);
        player_uid = player.uid;
        player_token = player.token;

        done();
    });
});


describe('Member Api', function(){
    before(function(done){
        conn.query('UPDATE member SET ? WHERE uid='+player_uid, {help_status: 0}, 
        function(err, rows){
            if (err){
                throw 'update member error:' + err;
            }
        });

        done();
    });

    it('/PUT liveordie', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'uid':player_uid, 'status':0};
        
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'liveordie'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/PUT liveordie(Failed authentication)', function(done) {
        var req = {'operator_uid':player_uid, 'token':player_token, 'uid':player_uid, 'status':0};

        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'liveordie'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('liveordie');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');
            
            done();
        });
    });
    it('/PUT update', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token,'uid':player_uid, 
            'position_e':'120.993035', 'position_n':'24.794468'};
        
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'update'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('update');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('valid_area').eql(true);
            
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
    it('/PUT update(Failed authentication)', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'uid':player_uid, 
            'position_e':'120.992135', 'position_n':'24.795156'};
        
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'update'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.an('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('update');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');
            
            done();
        });
    });
    it('/PUT callhelp', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'uid':player_uid, 
            'status':1, 'position_e':'120.13', 'position_n':'23.456'};
        var help_status = 0;
        
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'callhelp'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('callhelp');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('server_time').to.be.a('string');

            conn.query('SELECT * FROM member WHERE uid='+player_uid, function(err, rows){
                if (err){
                    throw 'read member error:' + err;
                } else {
                    help_status = rows[0].help_status;
                }

                help_status.should.eql(1);
                done();
            });
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
    it('/PUT callhelp(Failed authentication)', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'uid':player_uid, 
            'status':1, 'position_e':'120.13', 'position_n':'23.456'};
        
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'callhelp'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('callhelp');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');
            
            done();
        });
    });
    it('/GET read(with uid)', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'uid':player_uid};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'member', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'member', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/PUT money', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'uid':player_uid, 'money_amount':50};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'money'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/PUT money(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'uid':player_uid, 'money_amount':50};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'money'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('money');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/POST login', function(done) { 
        var req = {'email':'nick831111@gmail.com', 'password':'A100000000'};
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
            res.body.should.have.property('token').to.be.a('string');
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
});

describe('Mission Api', function(){
    var test_mid;
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
        });

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
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'title':'Test Mission',
                   'content':'This is a test mission.',
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
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/POST create(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'title':'Test Mission',
                   'content':'This is a test mission.',
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
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');
                        
            done();
        });
    });
    it('/PUT edit', function(done) { 
        var req = {'operator_uid':ADMIN_UID,'token':ADMIN_TOKEN, 'mid':test_mid, 'content':'modified Test mission'};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'mission', 'edit'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/PUT edit(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid,'token':player_token, 'mid':test_mid, 'content':'modified Test mission'};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'mission', 'edit'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('edit');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':ADMIN_UID,'token':ADMIN_TOKEN, 'mid':test_mid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'mission', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/DEL delete(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid,'token':player_token, 'mid':test_mid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'mission', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('mission');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/GET read(with mid)', function(done) { 
        var req = {'operator_uid':ADMIN_UID,'token':ADMIN_TOKEN, 'mid':test_mid};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'mission', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
        var req = {'operator_uid':player_uid, 'token':player_token};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'mission', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
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


describe('Report Api', function(){
    var image_data;
    var base64_image;
    var test_rid;
    before(function(){
        image_data = fs.readFileSync(path.join(ROOT_PATH, 'test/data/img/test.jpg'));
        base64_image = new Buffer(image_data).toString('base64');
    });
    beforeEach(function(){
        var test_report = {
            'uid':player_uid, 'mid':-1, 'url':'report-m-1-u'+player_uid+'.jpg',
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
        conn.query('DELETE FROM report WHERE mid = -1', function(err, result){
            if (err){
                console.log(err);
                throw 'delete test report error:' + err;
            }
        })
        conn.query('DELETE FROM report WHERE mid = -2', function(err, result){
            if (err){
                console.log(err);
                throw 'delete test report error:' + err;
            }
        })
        // fs.unlinkSync(path.join(ROOT_PATH, '/test/data/img/report-m-1-u'+player_uid+'.jpg'));
    });
    it('/POST create', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'mid':-2, 'image':base64_image};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'report', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('rid').to.be.a('number');
            // expect(fs.existsSync(path.join(ROOT_PATH, '/test/data/img/report-m-1-u'+player_uid+'.jpg'))).eql(true);
            
            done();
        });
    });
    it('/POST create(Multiple create)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'mid':-1, 'image':base64_image};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'report', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(5);
            res.body.should.have.property('server_time').to.be.a('string');
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
    it('/POST create(Failed authentication)', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'mid':-1, 'image':base64_image};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'report', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/PUT check', function(done) { 
        var req = {'operator_uid':ADMIN_UID,'token':ADMIN_TOKEN, 'rid':test_rid, 'status':1};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'report', 'check'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/PUT check(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid,'token':player_token, 'rid':test_rid, 'status':1};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'report', 'check'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('check');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/PUT edit', function(done) { 
         var req = {'operator_uid':player_uid, 'token':player_token,
         			'rid':test_rid, 'image':base64_image};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'report', 'edit'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
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
    it('/PUT edit(Failed authentication)', function(done) { 
        var req = {'operator_uid':ADMIN_UID,'token':ADMIN_TOKEN,
        	'rid':test_rid, 'image':base64_image};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'report', 'edit'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('edit');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'rid':test_rid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'report', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/DEL delete(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'rid':test_rid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'report', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/GET read(with mid)', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'mid':-1};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'report', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
                res.body.payload.objects[report].should.have.property('mid').eql(-1);
                res.body.payload.objects[report].should.have.property('url').to.be.a('string');
                res.body.payload.objects[report].should.have.property('status').to.be.a('number');
                res.body.payload.objects[report].should.have.property('time').to.be.a('string');
            }
            done();
        });
    });
    it('/GET read(with uid)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'uid':player_uid};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'report', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('report');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            for (report in res.body.payload.objects){
                res.body.payload.objects[report].should.have.property('rid').to.be.a('number');
                res.body.payload.objects[report].should.have.property('uid').to.be.a('number');
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


describe('Tool Api', function(){
    var image_data;
    var base64_image;
    var test_tid;

    before(function(){
        image_data = fs.readFileSync(path.join(ROOT_PATH, 'test/data/img/test.jpg'));
        base64_image = new Buffer(image_data).toString('base64');
    });
    beforeEach(function(done){
        var req = {'operator_uid':ADMIN_UID,'token':ADMIN_TOKEN, 'title':'Test tool', 
                   'content':'This is a test tool', 'image':base64_image, 
                   'expire':10, 'price':100};

        var url = HOST+path.join(HOST_PREFIX, 'tool', 'create')
	    request.post({url: url, form: req},
	    function(err, httpResponse, body){
	        var tool = JSON.parse(body);
	        test_tid = tool.payload.tid;

	        done();
	    });
        // conn.query('INSERT INTO tool SET ?', test_tool, function(err, result){
        //     if (err){
        //         throw 'create test tool error:' + err;
        //     } else {
        //         test_tid = result.insertId;
        //     }
        // })

    });
    after(function(){
        conn.query('DELETE FROM tool WHERE title = "Test tool"', function(err, result){
            if (err){
                throw 'delete test tool error:' + err;
            }
        });
        // fs.unlinkSync(path.join(ROOT_PATH, '/test/data/img/tool-Test tool.jpg'));
    })
    it('/POST create', function(done) { 
        var req = {'operator_uid':ADMIN_UID,'token':ADMIN_TOKEN, 'title':'Test tool', 
                   'content':'This is a test tool', 'image':base64_image, 
                   'expire':10, 'price':100};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'tool', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Attribute Name');
            res.body.payload.should.have.property('tid').to.be.a('number');
            // expect(fs.existsSync(path.join(ROOT_PATH, '/test/data/img/tool-Test tool.jpg'))).eql(true);

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
    it('/POST create(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid,'token':player_token, 'title':'Test tool', 
                   'content':'This is a test tool', 'image':base64_image, 
                   'expire':10, 'price':100};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'tool', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'tid':test_tid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'tool', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/DEL delete(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'tid':test_tid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'tool', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/GET read(with tid)', function(done) { 
        var test_read_tid = test_tid;
        var req = {'operator_uid':player_uid, 'token':player_token, 'tid':test_read_tid};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'tool', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('tool');
            res.body.should.have.property('action').eql('read');
            res.body.should.have.property('brea').eql(0);
            res.body.should.have.property('server_time').to.be.a('string');
            res.body.should.have.property('payload');
            res.body.payload.should.have.property('type').eql('Objects');
            res.body.payload.should.have.property('objects').to.be.an('array');
            // res.body.payload.objects.length.should.eql(1);
            for (tool in res.body.payload.objects){
                res.body.payload.objects[tool].should.have.property('tid').eql(test_read_tid);
                res.body.payload.objects[tool].should.have.property('title').to.be.a('string');
                res.body.payload.objects[tool].should.have.property('content').to.be.a('string');
                res.body.payload.objects[tool].should.have.property('url').to.be.a('string');
                res.body.payload.objects[tool].should.have.property('expire').to.be.a('number');
                res.body.payload.objects[tool].should.have.property('price').to.be.a('number');
            }
            
            chai.request(HOST)
            .get(path.join(HOST_PREFIX, 'download', 'img', res.body.payload.objects[0]['url']))
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.headers['content-length']).to.be.a('string').eql('7207');

                done();
            });
        });
    });
    it('/GET read(with out tid)', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'tool', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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


describe('Clue Api', function(){
    var test_cid;
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
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'content':'This is a test clue'};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'clue', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/POST create(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'content':'This is a test clue'};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'clue', 'create'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('clue');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');
            done();
        });
    });
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'cid':test_cid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'clue', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/DEL delete(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'cid':test_cid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'clue', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('clue');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/GET read(with cid)', function(done) {
        var test_read_cid = test_cid;
        var req = {'operator_uid':player_uid, 'token':player_token, 'cid':test_read_cid};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'clue', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
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
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'clue', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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


describe('Pack Api', function(){
    var test_pid;
    beforeEach(function(done){
        var test_pack = {'uid':-1, 'class':'TOOL', 'id':13};

        conn.query('INSERT INTO pack SET ?', test_pack, function(err, result){
            if (err){
                throw 'create test pack error:' + err;
            } else {
                test_pid = result.insertId;
            }
            
            done();
        });

    });
    after(function(){
        conn.query('DELETE FROM pack WHERE uid = -1', function(err, result){
            if (err){
                throw 'delete test pack error:' + err;
            }
        })
    })
    it('/POST create', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'uid':'-1', 'class':'TOOL', 'id':13};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'pack', 'create'))
        .send(req)
        .end(function(err, res) {
            test_pid = res.body.pid;

            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/POST create(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'uid':'-1', 'class':'TOOL', 'id':13};
        chai.request(HOST)
        .post(path.join(HOST_PREFIX, 'pack', 'create'))
        .send(req)
        .end(function(err, res) {
            test_pid = res.body.pid;

            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('pack');
            res.body.should.have.property('action').eql('create');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/DEL delete', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN, 'pid':test_pid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'pack', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
    it('/DEL delete(Failed authentication)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'pid':test_pid};
        chai.request(HOST)
        .delete(path.join(HOST_PREFIX, 'pack', 'delete'))
        .send(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
            res.body.should.have.property('object').eql('pack');
            res.body.should.have.property('action').eql('delete');
            res.body.should.have.property('brea').eql(4);
            res.body.should.have.property('server_time').to.be.a('string');

            done();
        });
    });
    it('/GET read(with uid)', function(done) { 
        var req = {'operator_uid':player_uid, 'token':player_token, 'uid':-1};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'pack', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(player_uid);
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
    it('/GET read(with out uid)', function(done) { 
        var req = {'operator_uid':ADMIN_UID, 'token':ADMIN_TOKEN};
        chai.request(HOST)
        .get(path.join(HOST_PREFIX, 'pack', 'read'))
        .query(req)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(ADMIN_UID);
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
