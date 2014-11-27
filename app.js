var http = require('http'),
	mongoose = require('mongoose');

var mongoUri = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL || 
  'mongodb://localhost/homeAutomation'; 
mongoose.connect(mongoUri,function(err) {
    if(err)
        console.trace('error occurred, when attempted to connect db. Error: ' + err);
});

var db = mongoose.connection;
var lightsSchema = mongoose.Schema({
    id: Number,
    isOn: Boolean
});
var Light = mongoose.model('Light', lightsSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log("connected");
	Light.remove({}, function(err) { 
	   console.log('collection removed') 
	});
	Light.find(function (err, lights) {
		if (err) return console.error(err);
		if(!lights.length){
			var l1 = new Light({
				id: 1,
				isOn:false
			});

			l1.save(function(err, l) {
				if (err) return console.error(err);
				console.log(l);
			});
		}
		console.log(lights);
	});
	
});

/*
*/


//lampe = {id,allumé?};
var lampeList=	[
					{id:0,on:true}
				];
// Chargement du fichier index.html affiché au client
console.log("--------START SERVER--------");
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


server.listen(8080);


function getLights(){
	
}

function iniDB(){
	console.log("init");
	
}
