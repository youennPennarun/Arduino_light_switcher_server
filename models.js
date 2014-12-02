module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var lightsSchema = new Schema({
		id: Number,
		name: String,
		isOn: Boolean
	});
	var settingsSchema = new Schema({
		weatherCityId: Number,
		weatherCityName: String,
		weatherCityCountry: String
	});
    var models = {
      Light : mongoose.model('Light', lightsSchema),
      Settings : mongoose.model('Settings', settingsSchema)
    };
	return models;
}
	
	