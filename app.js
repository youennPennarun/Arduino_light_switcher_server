var http = require('http'),
	mongoose = require('mongoose'),
	models = require('./models.js');
var connection = require('./mongooseConnection')(mongoose,models);

var Light = models.Light;
/*
*/


//lampe = {id,allumé?};
var lampeList=	[];
// Chargement du fichier index.html affiché au client
console.log("--------START SERVER ON PORT "+port+"--------");
var server = http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand on client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
	socket.broadcast.emit('newClientConnected', {id:45});
	socket.on('setLampeOff',function (data){
		console.log("lampe off");
		Light.update({ id : data.id}, { isOn : false }, { multi : false }, function (err) {
			if (err) { throw err; }
			socket.broadcast.emit('lightStateChanged', {id:data.id,isOn:false});
			socket.emit('lightStateChanged', {id:data.id,isOn:false});
		});
	});
	socket.on('setLampeOn',function (data){
		console.log("lampe on");
		Light.update({ id : data.id}, { isOn : true }, { multi : false }, function (err) {
			if (err) { throw err; }
			console.log("sending changed");
			socket.broadcast.emit('lightStateChanged', {id:data.id,isOn:true});
			socket.emit('lightStateChanged', {id:data.id,isOn:true});
		});
	});
	socket.on('reqLampesStates',function (){
		console.log("sending light state");
		
		Light.find(function (err, lights) {
			if (err) return console.error(err);
			console.log(lights);
			socket.emit('resLampesStates', lights);
		});
	});
})


server.listen(port);


function getLights(){
	
}

function iniDB(){
	console.log("init");
	
}
