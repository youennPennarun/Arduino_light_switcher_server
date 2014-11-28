module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var ObjectId = Schema.ObjectId;

	var lightsSchema = new Schema({
		id: Number,
		light: String,
		isOn: Boolean
	});
    var models = {
      Light : mongoose.model('Light', lightsSchema)
    };
	return models;
}
	
	