
$(function(){
	const socket = io()

	//obteniendo los elementos del DOM desde la interface
	const messageForm = $('#message-form')
	const messageBox = $('#message')
	const chat = $('#chat')

	//obteniendo datos del nicknameform
	const nickform = $('#nickform')
	const nickname = $('#nickname')
	const nickerror = $('#nickerror')

	const usernames = $('#usernames')

	//events
	nickform.submit(e => {
		e.preventDefault()
		socket.emit('new user', nickname.val() , response => {
			console.log(response)
			if(response){
				$('#nickwrap').hide()
				$('#app').show()
			}else{
				nickerror.html('Ya existe un usuario con ese usuario')
			}
		} )
		nickname.val('')
	})

	messageForm.submit(e => {
		e.preventDefault()
		socket.emit('send message', messageBox.val() , response =>{
			chat.append(`<p class="text-danger">${response}</p>`)
		})
		messageBox.val('')
	})
	//escuchar el evento del servidor
	socket.on('new message', data => {
		chat.append(`<b>${data.nick}: </b>${data.msg}<br>`)
	})
	socket.on('whisper', data => {
		chat.append(`<p class="whisper"><small><i>(Private)</i></small> <b>${data.nick}: </b>${data.msg}<p>`)
	})
	socket.on('usernames', names => {
		console.log(names)
		let html = ''

		names.map(username =>{
			html += `<p><i class="fas fa-user"></i>${username}<p>` 
		})
		console.log(html)
		usernames.html(html)

	})
	socket.on('load old msg', messages => {
		messages.map(message=>{
			displayMsg(message)
		})
	})

	function displayMsg(data){
		chat.append(`<p class="whisper"><b>${data.nick}: </b>${data.msg}</p>`)
	}

})