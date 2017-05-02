var path = require('path');
var request = require('request');
var ROOT_PATH = path.resolve('../')
var config = require(path.join(ROOT_PATH, 'src/config_production.json'));
var URL = 'http://'+config.host+':'+config.port+config.host_prefix;
var UID = 288;

setInterval(function(){
				request.get({url: URL+'/member/read?operator_uid='+UID});
				console.log('send');
			}, 5000); 
setInterval(()=>request.get({url: URL+'/mission/read?operator_uid='+UID}), 5000);
setInterval(()=>request.get({url: URL+'/report/read?operator_uid='+UID+'&uid='+UID}), 5000);
setInterval(()=>request.get({url: URL+'/tool/read?operator_uid='+UID}), 5000);
setInterval(()=>request.get({url: URL+'/clue/read?operator_uid='+UID}), 5000);
setInterval(()=>request.get({url: URL+'/pack/read?operator_uid='+UID}), 5000);
