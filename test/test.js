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
            done()
        });
    });
    it('/PUT update', function(done) { // <= Pass in done callback
        var req = {'operator_uid':0, 'uid':12, 'status':1, 'position_e':'120.13', 'position_n':'23.456'};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'update'))
        .send(req)
        .end(function(err, res) {
            err.should.be.null;
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

            done()
        });
    });
    it('/PUT callhelp', function(done) { // <= Pass in done callback
        var req = {'operator_uid':0, 'uid':12, 'status':1, 'position_e':'120.13', 'position_n':'23.456'};
        chai.request(HOST)
        .put(path.join(HOST_PREFIX, 'member', 'callhelp'))
        .send(req)
        .field('operator_uid', '0')
        .field('uid', '12')
        .field('position_e', '120.13')
        .field('position_n', '23.456')
        .end(function(err, res) {
            err.should.be.null;
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('uid').eql(12);
            res.body.should.have.property('object').eql('member');
            res.body.should.have.property('action').eql('callhelp');
            res.body.should.have.property('brea').to.be.an('number');

            done()
        });
    });
    // it('/GET read', function(done) { // <= Pass in done callback
    //     chai.request(HOST)
    //     .put(path.join(HOST_PREFIX, 'member', 'read'))
    //     .field('operator_uid', '0')
    //     .field('uid', '12')
    //     .end(function(err, res) {
    //         err.should.be.null;
    //         expect(res).to.have.status(200);
    //         expect(res).to.be.json;
    //         res.body.should.be.a('object');
    //         res.body.should.have.property('uid').eql(12);
    //         res.body.should.have.property('object').eql('member');
    //         res.body.should.have.property('action').eql('read');
    //         res.body.should.have.property('brea').to.be.an('number');
    //         if (!res.body.brea){
    //             res.body.should.have.property('payload');
    //             res.body.payload.should.have.property('type').eql('Objects');
    //             res.body.payload.should.have.property('Objects').to.be.an('array');

    //         }
    //         done()
    //     });
    // });
});


