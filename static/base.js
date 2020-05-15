document.addEventListener('DOMContentLoaded', () => {

    text_from_area = document.getElementById('container__textarea');            // Textarea
    btn_send = document.getElementsByClassName('container__textarea-btn');      // Button (Send)

    // Connect to  websockets
    // var because of the value of scope
    var socket = io.connect(location.protocol + '//' +                          // HTTP or HTTPS mostly protocols
                            document.domain + ':' +                             // Name of our domain
                            location.port);                                     // Our currently port what we worked on

    socket.on('connect', () => {                                                // When connected, make func (Higher order function)
        btn_send.onclick = () => {                                              // Onclick emit a message to flask from textarea
            const user_message = text_from_area.value;
            socket.emit('submit message', {'user_message': user_message});
        };
    });

    socket.on('post message', data => {                                         // Get a processed(annouced) data from socket.io and render it on page
        const li = document.createElement('li');
        li.insertAdjacentHTML("afterbegin", `${data.value}`);                   // Insert text to li element
        document.getElementsByClassName('container__messages-block').append(li);
    });
});
