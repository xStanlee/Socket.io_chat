document.addEventListener('DOMContentLoaded', () => {
    let time = new Date();

    let text_from_area = document.getElementById('container__textarea');
    const btn_send = document.querySelector('.container__textarea-btn');
    const chatMessages = document.querySelector('.container__messages-block');
    const loggedUsers = document.querySelector('.container__users-block');

    ///////////////////////////////////////////////////////
    ///////////// REUSABLE FUNCTIONS ES 5+
    ///////////////////////////////////////////////////////




    // Connect to  websockets
    var socket = io.connect(location.protocol + '//' +                          // HTTP or HTTPS mostly protocols
                            document.domain + ':' +                             // Name of our domain
                            location.port);                                     // Our currently port what we worked on

     socket.on('connect', () => {
                                                                                // User has connected to channel
        const url = window.location.pathname;
        const name = url.substring(url.lastIndexOf('/')+1);
        socket.emit('hello', {'name': name});

         ///////////////////////////////////////////////////////
         ///////////// SEND MESSAGES FUNCTIONS
         ///////////////////////////////////////////////////////
        text_from_area.onkeydown = function(e) {
            if (e.keyCode === 13) {
                let user_message = text_from_area.value;
                if (user_message != ''){
                    socket.emit('submit message', {'user_message': user_message});
                    text_from_area.value = ''
                }else {
                    return;
                }
            }
        }

        btn_send.onclick = () => {
            let user_message = text_from_area.value;
            if (user_message != ''){
            socket.emit('submit message', {'user_message': user_message});
            text_from_area.value = '';
        }else{
            return;
        }
    };
});
    socket.on('post message', data => {                                         // Get a processed(annouced) data from socket.io and render it on page
        const li = document.createElement('li');
        li.classList.add('container__mesages-item');
        li.insertAdjacentHTML("afterbegin", `${data.username}: ${data.user_message}  <small>${data.current_time}</small>`);  // Insert text to li element
        chatMessages.append(li);
        //scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('message hello', data =>{
        const li = document.createElement('li');
        li.classList.add('container__mesages-item');
        li.insertAdjacentElement("beforeend", `***--${data.name} has joined--***`);
        chatMessages.append(li);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    })
});
