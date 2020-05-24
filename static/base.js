document.addEventListener('DOMContentLoaded', () => {
    let time = new Date();

    const url = window.location.pathname;
    const name = url.substring(url.lastIndexOf('/')+1);

    const loggedUsers = document.querySelector('.container__users-block');
    const btn_send = document.querySelector('.container__textarea-btn');
    const chatMessages = document.querySelector('.container__messages-block');
    let text_from_area = document.getElementById('container__textarea');

    ///////////////////////////////////////////////////////
    ///////////// REUSABLE FUNCTIONS ES 5+
    ///////////////////////////////////////////////////////




    // Connect to  websockets
    var socket = io.connect(location.protocol + '//' +                          // HTTP or HTTPS mostly protocols
                            document.domain + ':' +                             // Name of our domain
                            location.port);                                     // Our currently port what we worked on

    var private_socket = io.connect(location.protocol + '//' +
                                    document.domain + ':' +
                                    location.port + '/' + 'private');           // New socket for priv messages from dif users

     socket.on('connect', () => {
                                                                                // User has connected to channel
        socket.emit('hello user', {
            'name': name
        });

        ///////////////////////////////////////////////////////
         ///////////// SEND MESSAGES FUNCTIONS
         ///////////////////////////////////////////////////////
        text_from_area.onkeydown = function(e) {
            if (e.keyCode === 13) {
                let user_message = text_from_area.value;
                if (user_message != ''){
                    socket.emit('submit message', {
                        'user_message': user_message
                    });
                    text_from_area.value = ''
                }else {
                    return;
                }
            }
        }

        btn_send.onclick = () => {
            let user_message = text_from_area.value;
            if (user_message != ''){
            socket.emit('submit message', {
                'user_message': user_message
            });
            text_from_area.value = '';
        }else{
            return;
        }
    };
    });
    socket.on('post message', data => {                                         // Get a processed(annouced) data from socket.io and render it on page
        const li = document.createElement('li');
        li.classList.add('container__mesages-item');
        if (data.username === name){
            li.classList.add('container__mesages-item--right');
        }
        li.insertAdjacentHTML("afterbegin", `${data.username}: ${data.user_message}  <small>${data.current_time}</small>`);  // Insert text to li element
        chatMessages.append(li);
        //scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('hello response', user => {
        // User connected info
        const li = document.createElement('li');
        li.classList.add('container__mesages-item-connected');
        li.insertAdjacentHTML("afterbegin", `***--${user.name} has connected!--***`)
        chatMessages.append(li);
        //scroll down
         chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('hello response', user => {
        // Connected users panel
        const user_li = document.createElement('li');
        const userID = user.randomID;
        user_li.setAttribute('id', `${userID}`);                                       // Add "random" id to li el
        user_li.classList.add('container__users-item');
        user_li.insertAdjacentHTML('beforeend', `<small>PM </br>*</small>${user.name}<small>*<br/> POKE</small>`);
        loggedUsers.append(user_li);
        console.log(userID);
        // Pop-up input
        const individual_user = document.getElementById(userID);
        individual_user.addEventListener('click', () => {
            console.log("it works!");
        })
         //scroll down
         chatMessages.scrollTop = chatMessages.scrollHeight;
    });
////////////////////////////////
////////////////////////////////
////////////// Private messages

});

