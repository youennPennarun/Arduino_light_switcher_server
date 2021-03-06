var http = require('http'),
	mongoose = require('mongoose'),
	config = require('./config.js'),
	models = require('./models.js')(mongoose);
var connection = require('./mongooseConnection')(mongoose,models,config);

var Light = models.Light;
var Settings = models.Settings;
/*
*/
var lampeList=	[];
// Chargement du fichier index.html affiché au client
console.log("--------START SERVER ON PORT "+config.port+"--------");
var server = http.createServer(function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand on client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
	socket.broadcast.emit('newClientConnected', {id:45});
	
	socket.on('reqLampesStates',function (){
		console.log("sending light state");
		
		Light.find(function (err, lights) {
			if (err) return console.error(err);
			socket.emit('resLampesStates', lights);
		});
	});
	socket.on('setLampeState',function (data){
		console.log("set lamp state");
		Light.update({ id : data.id}, { isOn : data.isOn }, { multi : false }, function (err) {
			if (err) { throw err; }
			socket.broadcast.emit('lightStateChanged', {id:data.id,isOn:data.isOn});
			socket.emit('lightStateChanged', {id:data.id,isOn:data.isOn});
		});
	});
	
	socket.on('reqSettings',function (){
		console.log("sending settings");
		
		Settings.find(function (err, settings) {
			if (err) return console.error(err);
			socket.emit('resSettings', settings);
		});
	});
	socket.on('setSettings',function (data){
		console.log("set settings");
		
		Settings.remove({}, function(err) { 
		   console.log('collection removed') 
		});
		var settings = new Settings({
				weatherCityId: data.cityId,
				weatherCityName: data.cityName,
				weatherCityCountry: data.cityCountry
		});
		settings.save(function(err, s ){
			if (err){
				return console.error(err);
			}else{
				socket.broadcast.emit('settingsChanged', settings);
				socket.emit('settingsChanged', settings);
			}
		});
	});
})


server.listen(config.port);


function getLights(){
	
}

function iniDB(){
	console.log("init");
	
}
