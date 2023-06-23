let socket = io()
let login = document.getElementById('login');
let messages = document.getElementById('chat');


if (login != null){
    login.onclick = function(){
        console.log("logging in")
        socket.connect();
    }
};

socket.on('connect', function(){
    let name = document.getElementById("name");
    console.log("connecting")
    socket.emit('notify', name.value + " joined!");
});

socket.on('notify', function(status){
    console.log(status, "notified");
});

socket.on('returndata', function(data){

    if (data['name'] != document.title.split(" ")[1]){
        var content = 
            '<div class=""><strong>' + data['name'] + '</strong></div>' + 
            '<div class="mx-3 px-3 word-wrap rounded-lg bg-blue-200 w-fit">' + data['message'] + '</div>'
    } else {
        var content = 
            '<div class="text-right"><strong>You</strong></div>' + 
            '<div class="ml-auto text-right mx-3 px-3 word-wrap rounded-lg bg-blue-200 w-fit">' + data['message'] + '</div>'
    }

    divtag = document.createElement('div');
    divtag.innerHTML = content;
    messages.appendChild(divtag)
});

let send = document.getElementById("sendmsg");

document.getElementById("message").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        send.click();        
    }
})

if (send != null){
    send.onclick = function(){
        msg = document.getElementById("message")
        if (msg.value != ""){
            socket.emit('data', {
                message: msg.value,
                name: document.title.split(" ")[1]
            })
        }
        msg.value = ""
    }
};
