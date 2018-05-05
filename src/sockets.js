const Chat = require('./models/Chat.js')

module.exports = function(io){
	const users = {}

	io.on('connection',  socket=> {
		console.log('new user registered');

		 Chat.find({} , (err, messages) =>{
				socket.emit('load old msg',messages)
			});

		socket.on('new user', (nickname , cb) => {
			if(nickname in users){
				cb(false);
			}else{
				cb(true);
				socket.nickname = nickname;
				users[socket.nickname] = socket;
				updateNickNames();
			}
			//io.sockets.emit('new message' , data)
		})

		socket.on('send message',  (message, cb) => {
			// message = 'asass' o '/w nick asasaas'
			let msg = message.trim()
			if(msg.substr(0,3) === '/w '){
				msg = msg.substr(3)
				const index = msg.indexOf(' ')
				if(index !== -1){
					var name = msg.substr(0, index)
					msg = msg.substr(index + 1)
					if(name in users){
						users[name].emit('whisper',{
							msg,
							nick:socket.nickname
						})
					}else{
						cb('Error! Please enter a Valid User')
					}
				}else{

				}
			}else{
				let mess = {
					msg:message,
					nick:socket.nickname
				}
				//guardarlo asincromamente
				let newMsg = new Chat(mess)
				newMsg.save()

				io.sockets.emit('new message' , mess)
			}
		})

		socket.on('disconnect', nickname => {
			if(!socket.nickname){
				return
			}else{
				delete users[socket.nickname]

				updateNickNames();
			}
		})

		function updateNickNames(){
			io.sockets.emit('usernames',Object.keys(users));
		}

	});

}