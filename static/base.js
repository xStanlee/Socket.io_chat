document.addEventListener('DOMContentLoaded', () => {
    let time = new Date();

    let text_from_area = document.getElementById('container__textarea');            // Textarea
    const btn_send = document.getElementsByClassName('container__textarea-btn');    // Button (Send)
    const chatMessages = document.querySelector('.container__messages-block')       // Container for text

    // Connect to  websockets
    // var because of the value of scope
    var socket = io.connect(location.protocol + '//' +                          // HTTP or HTTPS mostly protocols
                            document.domain + ':' +                             // Name of our domain
                            location.port);                                     // Our currently port what we worked on

    socket.on('connect', () => {                                                // When connected, make func (Higher order function)
        btn_send[0].onclick = () => {                                           // Onclick emit a message to flask from textarea
            let user_message = text_from_area.value;
            socket.emit('submit message', {'user_message': user_message});
            user_message = '';
        };
    });

    socket.on('post message', data => {                                         // Get a processed(annouced) data from socket.io and render it on page
        const li = document.createElement('li');
        li.classList.add('container__mesages-item');
        li.insertAdjacentHTML("afterbegin", `${data.username}: ${data.user_message}  <small>${data.current_time}</small>`);  // Insert text to li element
        chatMessages.append(li);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
});
