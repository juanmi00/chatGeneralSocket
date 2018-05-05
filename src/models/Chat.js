const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const chatSchema = new Schema({
	nick: String,
	msg:  String,
	created_at: {
		type :    Date,
		default : Date.now
	}
})

module.exports = mongoose.model( 'Chat' , chatSchema )
