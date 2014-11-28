var port = process.env.PORT || 8080;
var mongoUri = 	process.env.MONGOLAB_URI || 
				process.env.MONGOHQ_URL || 
				'mongodb://localhost/homeAutomation';
module.exports.port = port;
module.exports.mongoUri = mongoUri;