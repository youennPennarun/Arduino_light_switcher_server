module.exports = function(mongoose,models,config) {
	 
	mongoose.connect(config.mongoUri,function(err) {
		if(err)
			console.trace('error occurred, when attempted to connect db. Error: ' + err);
	});
	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		models.Light.remove({}, function(err) { 
		   console.log('collection removed') 
		});
		models.Light.find(function (err, lights) {
			if (err) return console.error(err);
			if(!lights.length){
				var l1 = new models.Light({
					id: 1,
					name: "Light kitchen",
					isOn:false
				});

				l1.save(function(err, l) {
					if (err){
						return console.error(err);
					}else{
						console.log(l1+" added");
					}
				});
			}
		});
		
	});
	return db;

}