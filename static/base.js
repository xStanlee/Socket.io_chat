document.addEventListener('DOMContentLoaded', () => {
    let time = new Date();

    const url = window.location.pathname;
    const name = url.substring(url.lastIndexOf('/')+1);

    const loggedUsers = document.querySelector('.container__users-block');
    const data_storage = document.querySelector('.data_storage')
    const btn_send = document.querySelector('.container__textarea-btn');
    const chatMessages = document.querySelector('.container__messages-block');
    let sortedMessages = Array.from(document.getElementsByClassName('checkerList'));
    let text_from_area = document.getElementById('container__textarea');


    let listOfUsers = [];

    class User{
        constructor(username, id){
            this.username = username;
            this.id = id;
        }
    };

    ///////////////////////////////////////////////////////
    ///////////// REUSABLE FUNCTIONS ES 5+
    function jsonCorecter(data){
        data = data.replace(/"/g, '`');
        data = data.replace(/'/g, '"');
        data = data.replace(/`/g, "'");
        return data;
    }
    function randomInt(min, max) {
        return min + Math.floor((max - min) * Math.random());
    }
    function sendInfo(url, name){
        navigator.sendBeacon(url, name);
    }
    function emitGoodBye(name, id){
        socket.emit('disconnected', {
            "username": name,
            "pokeID": 'notThisWay'
        });
    }
    // Connect to  websockets

    var socket = io.connect(location.protocol + '//' +                          // HTTP or HTTPS mostly protocols
                            document.domain + ':' +                             // Name of our domain
                            location.port);                                     // Our currently port what we worked on

    var private_socket = io.connect(location.protocol + '//' +
                                    document.domain + ':' +
                                    location.port + '/' + 'private');           // New socket for priv messages from dif users
    // Render already loggedUsers
    console.log((loggedUsers));

    let json = data_storage.textContent.trim();
    json = JSON.parse(jsonCorecter(json));
    let entries = Object.entries(json);

    // Set first element of array (username) to uppercase because of limitt of sorted algorithm
    entries = entries.map(function(val){ return [val[0].toUpperCase(), val[1]] });
    entries = entries.sort();

    for(const [username,sessionID] of entries)  {
        console.log(`${username} have a session id equal this one === ${sessionID} and their random int will be ${randomInt(1, 99999)}`);
        const li = document.createElement('li');
        li.setAttribute('id', `${sessionID}`);                                       // Add "random" id to li el
        li.classList.add('container__users-item');
        li.insertAdjacentHTML('beforeend', `<small>PM </br>*</small>${username}<small>*<br/> POKE</small>`);
        loggedUsers.append(li);
        // Send pokeMessage();
        document.getElementById(sessionID).addEventListener('click', () => {
            if(document.getElementById(sessionID + 0) === null){
                const pokeUser = document.createElement('div');
                pokeUser.setAttribute('id', (sessionID + 0));
                pokeUser.classList.add('container__users-poke');
                console.log(pokeUser);
                const eachUser = {
                    spanElement: sessionID + 1,
                    inputElement: sessionID + 2,
                    buttonElement: sessionID + 3
                };
                pokeUser.insertAdjacentHTML('beforeend',
                                            `<image id="${eachUser.spanElement}" src="/static/close.png" class="container__users-poke-img">
                                            <input id="${eachUser.inputElement}" class="container__users-poke-input" maxlength="40" name="poke-input">
                                            <button id="${eachUser.buttonElement}" class="container__users-poke-btn">POKE!</button>`);
                li.insertAdjacentElement('beforebegin', pokeUser);
                // Pop up del();
                document.getElementById(eachUser.spanElement).addEventListener('click', () => {
                    document.getElementById(sessionID + 0).remove();
                    });
                     // Pop up send poke();
                     ['keydown', 'click'].forEach(evt =>
                        document
                        .getElementById(eachUser.buttonElement)
                        .addEventListener(evt, event => {
                            if ((evt === 'keyup' && event.keyCode === 13) || evt === 'click'){
                                const pokeMessage = document.getElementById(eachUser.inputElement).value;
                                private_socket.emit('poke message', {
                                    'username': username,
                                    'sessionID': sessionID,
                                    'pokeMessage': pokeMessage
                                });
                                pokeUser.parentNode.removeChild(pokeUser);
                        }   else{
                            return;
                        }
                    }), false);
            }else{
                return;
            }
        // Scroll to top();

        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}
    // Render old messages with sorted styles();

    for (let i = 0; i < sortedMessages.length; i++) {
        let transitionSelf = sortedMessages[i].textContent;                    // Sort user message in UI adding class.
        transitionSelf = transitionSelf.substring(0, transitionSelf.indexOf(':'));
        transitionSelf = transitionSelf.trim();
        if (transitionSelf === name){
            sortedMessages[i].classList.add('container__mesages-item--right');
        } else { console.log ('sumtink wen rong!');}
    }



    // Socket events!
     socket.on('connect', () => {
                                                                                // User has connected to channel
        socket.emit('hello user', {
            'name': name
        });

         //////////////////////////////////////////////////////
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

        // Scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    socket.on('hello response', user => {

        // Connected users panel
        const user_li = document.createElement('li');
        const userID = user.sessionID;
        user_li.setAttribute('id', `${userID}`);                                       // Add "random" id to li el
        user_li.classList.add('container__users-item');
        user_li.insertAdjacentHTML('beforeend', `<small>PM </br>*</small>${user.name}<small>*<br/> POKE</small>`);
        loggedUsers.append(user_li);

        // Pop-up input
        const individual_user = document.getElementById(userID);
        individual_user.addEventListener('click', () => {
            if(document.getElementById(user.sessionID+0) === null){
                const pokeUser = document.createElement('div');
                pokeUser.setAttribute('id', (user.sessionID+0));
                pokeUser.classList.add('container__users-poke');
                const eachUser = {
                    spanElement: user.sessionID + 1,
                    inputElement: user.sessionID + 2,
                    buttonElement: user.sessionID + 3
                };
                pokeUser.insertAdjacentHTML('beforeend',
                                            `<image id="${eachUser.spanElement}" src="/static/close.png" class="container__users-poke-img">
                                            <input id="${eachUser.inputElement}" class="container__users-poke-input" maxlength="40" name="poke-input">
                                            <button id="${eachUser.buttonElement}" class="container__users-poke-btn">POKE!</button>`);
                user_li.insertAdjacentElement('beforebegin', pokeUser);

                // Pop up del();
                document.getElementById(eachUser.spanElement).addEventListener('click', () => {
                    document.getElementById(user.sessionID+0).remove();
                    });

                    // Pop up send poke();
                    ['keydown', 'click'].forEach(evt =>
                        document
                        .getElementById(eachUser.buttonElement)
                        .addEventListener(evt, event => {
                            if ((evt === 'keyup' && event.keyCode === 13) || evt === 'click'){
                                const pokeMessage = document.getElementById(eachUser.inputElement).value;
                                private_socket.emit('poke message', {
                                    'username': user.name,
                                    'sessionID': user.sessionID,
                                    'pokeMessage': pokeMessage
                                });
                                pokeUser.parentNode.removeChild(pokeUser);
                        }   else{
                            return;
                        }
                    }), false);
                    }else{
                        return;
                    }
         //Scroll down
         chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    });

    //Poke message
    private_socket.on('poked',  message => {
        swal(`${message.username}`, `${message.message}`, "info");
    });

    // Not working or hopely works
    window.addEventListener('beforeunload', (event) => {
        // Cancel the event as stated by the standard.
        event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = '';
        // emiting data
        emitGoodBye(name);
      });
    // Disconnected-feedback event
    socket.on('disconected-feedback', diss => {
        // Send disconnected message
        const li = document.createElement('li');
        li.classList.add('container__mesages-item-disconected');
        li.insertAdjacentHTML("afterbegin", `###  ${diss.username} disconnected from channel  ###`)  // Insert text to li element
        chatMessages.append(li);

        // remove from UI list[];
        const el = document.getElementById(diss.sessionID);
        loggedUsers.removeChild(el);
    });
});
