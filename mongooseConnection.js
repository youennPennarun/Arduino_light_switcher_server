module.exports = function(mongoose) {
	var port = process.env.PORT || 8080;
	var mongoUri = 	process.env.MONGOLAB_URI || 
					process.env.MONGOHQ_URL || 
					'mongodb://localhost/homeAutomation'; 
	mongoose.connect(mongoUri,function(err) {
		if(err)
			console.trace('error occurred, when attempted to connect db. Error: ' + err);
	});

	var db = mongoose.connection;
	var lightsSchema = mongoose.Schema({
		id: Number,
		light: String,
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
					name: "Light kitchen",
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
	return db;

}