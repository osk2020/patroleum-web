'use strict';

var messagesEl, loginEl, usernameEl, passwordEl, loginmsgEl;
window.onload = () => {
    const socket = io.connect(location.host);

    loginEl = document.getElementById('login');
    messagesEl = document.getElementById('messages');
    usernameEl = document.getElementById('username');
    passwordEl = document.getElementById('password');
    loginmsgEl = document.getElementById("login-msg");
    loginEl.onsubmit = function ($event) {
        $event.preventDefault();
        
        loginmsgEl.style.visibility = 'hidden';
        var userEmail = usernameEl.value;
        var password = passwordEl.value;
        socket.emit("login", {
            user: userEmail,
            password: password
        });
    };

    socket.on("incorrect-user", () =>
    {
        loginmsgEl.style.visibility = 'visible';
    });

    socket.on("loggedin", async data =>
    {
        loginEl.parentNode.style.visibility = 'hidden';
        
        var msgContainer = createMsgBox("Patroleum", "Logged In", "chat-msg msg-info");
        messagesEl.appendChild(msgContainer);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        msgContainer = createMsgBox("Daniel", "Please call police now", "chat-msg msg-user");
        messagesEl.appendChild(msgContainer);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        msgContainer = createMsgBox("Agent", "OK Calling Now", "chat-msg msg-peer");
        messagesEl.appendChild(msgContainer);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    });
}

function createMsgBox($from, $msg, $class) {
    console.log('*index*  createMsgBox(from',$from,', msg',$msg,', class',$class,')');
    // date sent
    var d = new Date();
    var hr = d.getHours().toString(), min = d.getMinutes().toString();
    var msgTime = (hr.length == 1 ? 0+hr : hr)+":"+(min.length == 1 ? 0+min : min);
    //from name txt and message time text
    var sentLbl = document.createElement('span');
    sentLbl.innerHTML = $from.toUpperCase()+': ';
    var timeLbl = document.createElement('span');
    timeLbl.innerHTML = msgTime;
    //header container for name and time ele.
    var headerTxt = document.createElement('div');
    var nm = headerTxt.appendChild(sentLbl);
    nm.className = 'msg-from';
    var tm = headerTxt.appendChild(timeLbl);
    tm.className = 'msg-time';
    headerTxt.className = 'msg-header';
    //message text
    var msgEl = document.createElement('div');
    msgEl.innerHTML = $msg;
  
    var msgContainer = document.createElement('div');
    msgContainer.appendChild(headerTxt);
    msgContainer.appendChild(msgEl);
    //msg-user, msg-alert, msg-info
    if(!!$class) msgContainer.className = $class;
  
    return msgContainer;
  };